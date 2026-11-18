// Resources for the Resource library: from Supabase, with loading and error states.
// Without Supabase configured, the bundled copy in ../data is used.
import { useRemote } from '../../../shared/hooks/useRemote.js';
import { fetchResources } from '../../../shared/lib/content.js';
import { supabase } from '../../../shared/lib/supabase.js';
import { RES, ROLES } from '../data/resources.js';
import { resourcesFromRows, orderBundled } from '../logic/fromRows.js';

const ROLE_ORDER = ROLES.filter((r) => r.id !== 'all').map((r) => r.id);

export function useResourceData() {
  return useRemote(async () => {
    if (!supabase) return { data: orderBundled(RES, ROLE_ORDER), error: null };
    const { data, error } = await fetchResources();
    return error
      ? { data: null, error }
      : { data: resourcesFromRows(data, ROLE_ORDER), error: null };
  });
}
