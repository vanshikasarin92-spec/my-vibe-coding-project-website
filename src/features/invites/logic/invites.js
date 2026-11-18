// Invite rules and dashboard figures. Pure functions: no React, no network.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns a message code, or null when the address can be sent.
export function validateRecipient(email, selfEmail, alreadyInvited = []) {
  const e = (email || '').trim().toLowerCase();
  if (!e) return 'missing';
  if (!EMAIL.test(e)) return 'format';
  if (selfEmail && e === selfEmail.toLowerCase()) return 'self';
  if (alreadyInvited.includes(e)) return 'duplicate';
  return null;
}

// Turns a Supabase error from sending an invite into a message code.
export function inviteErrorCode(error) {
  if (!error) return null;
  const msg = (error.message || '').toLowerCase();
  if (error.code === 'timeout') return 'network';
  if (error.code === '23505' || msg.includes('duplicate')) return 'duplicate';
  if (msg.includes('invite yourself')) return 'self';
  if (msg.includes('sign in')) return 'signedOut';
  if (msg.includes('check constraint')) return 'format';
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('not configured'))
    return 'network';
  return 'unknown';
}

// The dashboard tiles, from one row of invite_metrics(). Every value comes from
// the row; nothing here is typed in.
export function metricTiles(m) {
  const n = (v) => Number(v || 0);
  const rate =
    m.acceptance_rate === null || m.acceptance_rate === undefined
      ? null
      : Number(m.acceptance_rate);
  return [
    { id: 'sent', label: 'Invites sent', value: String(n(m.sent)), note: `${n(m.my_sent)} by you` },
    {
      id: 'accepted',
      label: 'Accepted',
      value: String(n(m.accepted)),
      note: `${n(m.my_accepted)} of yours`,
    },
    {
      id: 'rate',
      label: 'Acceptance rate',
      value: rate === null ? '–' : `${rate % 1 === 0 ? rate.toFixed(0) : rate.toFixed(1)}%`,
      note: rate === null ? 'No invites yet' : 'Accepted of invites not cancelled',
    },
    {
      id: 'pending',
      label: 'Pending',
      value: String(n(m.pending)),
      note: `${n(m.cancelled)} cancelled`,
    },
    {
      id: 'week',
      label: 'Sent in the last 7 days',
      value: String(n(m.sent_last_7_days)),
      note: `${n(m.accepted_last_7_days)} accepted in the last 7 days`,
    },
  ];
}

export function statusLabel(status) {
  return { pending: 'Pending', accepted: 'Accepted', cancelled: 'Cancelled' }[status] || status;
}

// "17 Nov 2026"
export function formatDay(iso) {
  const d = new Date(iso);
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
}

// "17 Nov 2026, 14:05"
export function formatTime(iso) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${formatDay(iso)}, ${hh}:${mm}`;
}
