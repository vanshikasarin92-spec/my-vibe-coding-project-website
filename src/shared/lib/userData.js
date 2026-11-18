// Reads and writes a signed-in person's own records in Supabase.
// Two locks keep people to their own rows:
//   1. Row level security in the database: every policy is auth.uid() = user_id
//      (profiles: auth.uid() = id). This is the one that matters; it holds even
//      if someone calls the API directly.
//   2. Every query here also filters on the signed-in user's id, so the app never
//      asks for anyone else's rows in the first place.
// Every function resolves to { data, error } and never throws.
import { supabase } from './supabase.js';
import { request } from './request.js';

const NOT_CONFIGURED = { data: null, error: { message: 'Supabase is not configured.' } };

// Settles within the time limit and never throws (see request.js).
function run(query) {
  if (!supabase) return Promise.resolve(NOT_CONFIGURED);
  return request(query);
}

// Profile, actions done and checklist ticks for one person.
export async function loadUserData(userId) {
  if (!supabase) return NOT_CONFIGURED;
  const [profile, completions, ticks] = await Promise.all([
    run(
      supabase
        .from('profiles')
        .select('role_id, lang, library_role_id, client_updated_at')
        .eq('id', userId)
        .maybeSingle(),
    ),
    run(
      supabase
        .from('action_completions')
        .select('role_id, kind, completed_at')
        .eq('user_id', userId),
    ),
    run(
      supabase
        .from('checklist_ticks')
        .select('item_id, ticked, client_updated_at')
        .eq('user_id', userId),
    ),
  ]);
  const error = profile.error || completions.error || ticks.error;
  if (error) return { data: null, error };
  return {
    data: { profile: profile.data, completions: completions.data, ticks: ticks.data },
    error: null,
  };
}

export function saveProfile(userId, fields) {
  return run(supabase.from('profiles').update(fields).eq('id', userId));
}

// completions: [{ role_id, kind, completed_at }]
export function saveCompletions(userId, completions) {
  if (!completions.length) return Promise.resolve({ data: null, error: null });
  return run(
    supabase.from('action_completions').upsert(
      completions.map((c) => ({ ...c, user_id: userId })),
      { onConflict: 'user_id,role_id,kind', ignoreDuplicates: true },
    ),
  );
}

// ticks: { [itemId]: true|false }; at: { [itemId]: ms } when each was changed.
// The database ignores a write older than the one it holds (last-write-wins).
export function saveTicks(userId, ticks, at = {}) {
  const rows = Object.entries(ticks).map(([item_id, ticked]) => ({
    user_id: userId,
    item_id,
    ticked,
    client_updated_at: new Date(at[item_id] || Date.now()).toISOString(),
  }));
  if (!rows.length) return Promise.resolve({ data: null, error: null });
  return run(supabase.from('checklist_ticks').upsert(rows, { onConflict: 'user_id,item_id' }));
}

// Records a visit for the signed-in person (visits table + visit dates on the
// profile). The app calls it once per browser session.
export function recordVisit() {
  return run(supabase.rpc('start_visit'));
}
