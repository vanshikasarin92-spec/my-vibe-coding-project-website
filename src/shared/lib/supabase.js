// The Supabase client. Uses the publishable key only: row level security in the
// database decides what each signed-in person can read and write.
// If the env values are missing, `supabase` is null and the app runs signed-out,
// on bundled data and browser storage, exactly as before.
import { createClient } from '@supabase/supabase-js';
import { timedFetch } from './request.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
        // A request that hasn't answered in 8 seconds is aborted (see request.js).
        global: { fetch: timedFetch() },
      })
    : null;
