// Date maths and formatting. Pure functions: pass `now` in tests, or let it default.

export const DAY = 86400000;

// Whole days from now until an ISO date (YYYY-MM-DD, read as UTC midnight). Never negative.
export function daysUntil(isoDate, now = Date.now()) {
  return Math.max(0, Math.ceil((Date.parse(isoDate + 'T00:00:00Z') - now) / DAY));
}

// Whole days since a timestamp. Never negative.
export function daysSince(ts, now = Date.now()) {
  return Math.max(0, Math.round((now - ts) / DAY));
}

// "28 Oct 2026" / "28 oct. 2026", using the month names for the current language.
export function formatDate(ts, months) {
  const d = new Date(ts);
  return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

// "28 Oct" / "28 oct."
export function formatDayMonth(ts, months) {
  const d = new Date(ts);
  return d.getDate() + ' ' + months[d.getMonth()];
}
