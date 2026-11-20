// Browser storage that never throws. Storage can be blocked (private windows,
// cleared site data, locked-down browsers), so every read falls back and every
// write fails quietly. Use it only for per-device conveniences.

function safe(kind) {
  return {
    get(key) {
      try {
        return window[kind].getItem(key);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        window[kind].setItem(key, value);
      } catch (e) {
        /* storage unavailable */
      }
    },
  };
}

export const store = safe('localStorage');
export const session = safe('sessionStorage');

export function readJSON(key, fallback) {
  try {
    const raw = store.get(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function writeJSON(key, value) {
  store.set(key, JSON.stringify(value));
}

// Keys used across pages.
export const KEYS = {
  profile: 'abd-profile', // Your role: role, language, actions done, visit dates
  libraryRole: 'abd-role', // Resource library role filter
  checks: 'abd-checks', // Checklist ticks
  checksAt: 'abd-checks-at', // When each tick last changed (last-write-wins)
  tab: 'abd-tab', // Last platform tab
  visit: 'abd-visit', // Session flag so a visit is counted once per browser session
  accountVisit: 'abd-account-visit', // Same, for the signed-in person's account
  analytics: 'abd-analytics', // Anonymous visitor and visit ids for page-view counts
};
