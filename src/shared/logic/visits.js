// Rules for counting visits. Pure functions: no React, no network, no storage.

// A visit ends after 30 minutes without a page view; the next view starts a new one.
export const VISIT_GAP_MS = 30 * 60 * 1000;

// The ids for the next page view. `stored` is what the browser kept last time
// ({ visitorId, sessionId, lastSeen }) or null; `makeId` returns a new random id.
export function nextIds(stored, now, makeId) {
  const s = stored && typeof stored === 'object' ? stored : {};
  const visitorId = s.visitorId || makeId();
  const fresh = !s.sessionId || !Number.isFinite(s.lastSeen) || now - s.lastSeen > VISIT_GAP_MS;
  return { visitorId, sessionId: fresh ? makeId() : s.sessionId, lastSeen: now };
}

// Whether this browser should be counted. Not counted: local development, test
// automation, and browsers that ask not to be tracked.
export function shouldCount({ configured, hostname, webdriver, globalPrivacyControl, doNotTrack }) {
  if (!configured) return false;
  if (webdriver) return false;
  if (globalPrivacyControl === true) return false;
  if (doNotTrack === '1' || doNotTrack === 'yes') return false;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') return false;
  return true;
}

// Time the page was actually on screen: the visible stretches added up.
export function visibleMs(acc, visibleSince, now) {
  return Math.max(0, Math.round(acc + (visibleSince === null ? 0 : now - visibleSince)));
}
