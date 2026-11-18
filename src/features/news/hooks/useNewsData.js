// News for the News screen: from Supabase, with loading and error states.
// Without Supabase configured, the bundled copy in ../data is used.
import { useRemote } from '../../../shared/hooks/useRemote.js';
import { fetchNews } from '../../../shared/lib/content.js';
import { supabase } from '../../../shared/lib/supabase.js';
import { NEWS } from '../data/news.js';
import { newsFromRows } from '../logic/fromRows.js';

export function useNewsData() {
  return useRemote(async () => {
    if (!supabase) return { data: NEWS, error: null };
    const { data, error } = await fetchNews();
    return error ? { data: null, error } : { data: newsFromRows(data), error: null };
  });
}
