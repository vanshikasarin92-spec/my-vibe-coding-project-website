// Rules for moving progress between this browser and a person's account.
// Pure functions: the hooks do the reading and writing.
//
// Conflicts are settled by last-write-wins: each edit carries the time the person
// made it (local `updatedAt` / `at`, account `client_updated_at`), and the later
// edit wins. The database applies the same rule (migration last_write_wins).
// Completed actions are only ever added, so both sides are kept.
//
// Local actions shape:  { [roleId]: { do?: ms, next?: ms } }
// Account rows shape:   [{ role_id, kind, completed_at: ISO string }]

const ms = (iso) => (iso ? Date.parse(iso) : 0);

export function actionsToRows(actions) {
  const rows = [];
  Object.entries(actions || {}).forEach(([role_id, kinds]) => {
    ['do', 'next'].forEach((kind) => {
      if (kinds && kinds[kind]) {
        rows.push({ role_id, kind, completed_at: new Date(kinds[kind]).toISOString() });
      }
    });
  });
  return rows;
}

export function rowsToActions(rows) {
  const actions = {};
  (rows || []).forEach((r) => {
    actions[r.role_id] = { ...(actions[r.role_id] || {}), [r.kind]: Date.parse(r.completed_at) };
  });
  return actions;
}

// Union of both; when both have the same action, keep the earlier time (when it was first done).
export function mergeActions(a, b) {
  const out = {};
  [a || {}, b || {}].forEach((src) => {
    Object.entries(src).forEach(([role, kinds]) => {
      Object.entries(kinds || {}).forEach(([kind, ts]) => {
        if (!ts) return;
        const prev = out[role] && out[role][kind];
        out[role] = { ...(out[role] || {}), [kind]: prev ? Math.min(prev, ts) : ts };
      });
    });
  });
  return out;
}

// Merge this browser's profile with the account's.
// Role and language: last-write-wins (a tie keeps this browser's).
// Actions: both sides kept. Visit dates stay this browser's.
export function mergeProfile(local, account, roleIds, now = Date.now()) {
  const acct = account && account.profile;
  const accountRole = acct && roleIds.includes(acct.role_id) ? acct.role_id : null;
  const accountAt = acct ? ms(acct.client_updated_at) : 0;
  const accountActions = rowsToActions(account ? account.completions : []);
  if (!local) {
    if (!accountRole) return null;
    return {
      role: accountRole,
      lang: acct.lang === 'fr' ? 'fr' : 'en',
      updatedAt: accountAt || now,
      actions: accountActions,
      lastVisit: now,
      prevVisit: null,
    };
  }
  const accountNewer = accountRole && accountAt > (local.updatedAt || 0);
  return {
    ...local,
    ...(accountNewer
      ? { role: accountRole, lang: acct.lang === 'fr' ? 'fr' : 'en', updatedAt: accountAt }
      : {}),
    actions: mergeActions(local.actions, accountActions),
  };
}

// Checklist ticks, item by item: last-write-wins (a tie keeps this browser's).
// local: { [id]: bool }, localAt: { [id]: ms }, rows: [{ item_id, ticked, client_updated_at }]
// Returns { ticks, at }.
export function mergeTicks(local, localAt, rows) {
  const ticks = { ...(local || {}) };
  const at = { ...(localAt || {}) };
  (rows || []).forEach((r) => {
    const remoteAt = ms(r.client_updated_at);
    const localTime = at[r.item_id] || 0;
    if (!(r.item_id in ticks) || remoteAt > localTime) {
      ticks[r.item_id] = !!r.ticked;
      at[r.item_id] = remoteAt;
    }
  });
  return { ticks, at };
}

// Only the ticks that differ from what the account already has.
export function changedTicks(next, prev) {
  const out = {};
  Object.keys(next).forEach((id) => {
    if (!!next[id] !== !!(prev || {})[id]) out[id] = !!next[id];
  });
  return out;
}
