// Rules for the "Your role" profile. Pure functions: each takes a profile and
// returns a new one; nothing here reads or writes storage (see hooks/useProfile.js).
//
// Profile shape: { role, lang, actions: { [roleId]: { do?: ts, next?: ts } }, lastVisit, prevVisit }

// A saved profile is usable only if its role still exists.
export function validProfile(saved, roleIds) {
  if (!(saved && saved.role && roleIds.includes(saved.role))) return null;
  return { ...saved, actions: saved.actions || {} };
}

// A new browser session moves lastVisit to prevVisit. A prevVisit is what
// opens the "Welcome back" screen.
export function startVisit(profile, isNewSession, now = Date.now()) {
  if (!profile || !isNewSession) return profile;
  return { ...profile, prevVisit: profile.lastVisit || null, lastVisit: now };
}

// Which screen a visit opens on.
export function firstScreen(profile) {
  if (!profile) return 'picker';
  return profile.prevVisit ? 'return' : 'role';
}

// updatedAt records when the person last changed role or language, for last-write-wins.
export function chooseRole(profile, roleId, lang, now = Date.now()) {
  const next = { actions: {}, ...(profile || {}), role: roleId, lang, updatedAt: now };
  if (!next.lastVisit) next.lastVisit = now;
  return next;
}

export function setLanguage(profile, lang, now = Date.now()) {
  return profile ? { ...profile, lang, updatedAt: now } : profile;
}

// kind is 'do' (Do this now) or 'next' (Do this next).
export function markActionDone(profile, kind, now = Date.now()) {
  const done = { ...(profile.actions[profile.role] || {}), [kind]: now };
  return { ...profile, actions: { ...profile.actions, [profile.role]: done } };
}

export function actionsFor(profile) {
  return (profile && profile.actions[profile.role]) || {};
}

// What the "Do this now" card should show: the first action, the next one, or all done.
export function nextStep(acts) {
  if (!acts.do) return 'do';
  if (!acts.next) return 'next';
  return 'allDone';
}
