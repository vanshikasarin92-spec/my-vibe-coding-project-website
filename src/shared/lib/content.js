// Reads published content from Supabase. Content tables are readable by everyone
// (signed in or not). Each function resolves to { data, error } and never throws;
// the feature's logic/ turns the rows into the shape its screens use.
import { supabase } from './supabase.js';

async function run(query) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } };
  try {
    const { data, error } = await query;
    return { data, error };
  } catch (e) {
    return { data: null, error: { message: e.message || 'Network error' } };
  }
}

// News, in the order it was published to the hub, with sources in order.
export function fetchNews() {
  return run(
    supabase
      .from('news_items')
      .select(
        'id, published_on, date_label, topic_id, tag, title, body, means_lead, means, sources_label, news_sources(position, label, url)',
      )
      .order('id')
      .order('position', { referencedTable: 'news_sources' }),
  );
}

// Resource library: groups, their resources and each resource's roles.
export function fetchResources() {
  return run(
    supabase
      .from('resource_groups')
      .select(
        'id, name, sort_order, resources(position, title, url, description, resource_roles(library_role_id))',
      )
      .order('sort_order')
      .order('position', { referencedTable: 'resources' }),
  );
}
