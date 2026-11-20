// Page-view analytics: record a view, report how long it was on screen, and read
// the site totals. No personal data is sent: only random ids the browser keeps
// and the page's route id. Reads are signed-in only (see the page_views migration).
import { supabase } from './supabase.js';
import { request } from './request.js';
import { readJSON, writeJSON, KEYS } from './storage.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const analyticsConfigured = Boolean(supabase);

export function newId() {
  if (globalThis.crypto && crypto.randomUUID) return crypto.randomUUID();
  // Fallback for very old browsers: a version-4 shaped random id.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const readVisitIds = () => readJSON(KEYS.analytics, null);
export const writeVisitIds = (ids) => writeJSON(KEYS.analytics, ids);

// Fire and forget: analytics must never get in the way of the page.
export function recordView({ id, visitorId, sessionId, page }) {
  if (!supabase) return Promise.resolve();
  return request(
    supabase.from('page_views').insert({ id, visitor_id: visitorId, session_id: sessionId, page }),
  );
}

// Sent with keepalive so it still arrives when the tab is closing.
export function endView({ id, visitorId, ms }) {
  if (!url || !key) return;
  try {
    fetch(`${url}/rest/v1/rpc/end_page_view`, {
      method: 'POST',
      keepalive: true,
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ view_id: id, visitor: visitorId, ms }),
    }).catch(() => {});
  } catch (e) {
    /* best effort */
  }
}

export function fetchSiteAnalytics(days) {
  if (!supabase)
    return Promise.resolve({ data: null, error: { message: 'Supabase is not configured.' } });
  return request(supabase.rpc('site_analytics', { days }));
}
