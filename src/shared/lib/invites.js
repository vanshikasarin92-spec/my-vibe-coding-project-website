// Invites in Supabase. Row level security decides what each person sees: the
// invites they sent and the ones addressed to their email. The database sets the
// sender, the time and the starting status. Each function resolves to
// { data, error } and never throws.
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

// recipient_email only: the database fills in sender_email, status and created_at.
export function sendInvite(recipientEmail) {
  return run(supabase.from('invites').insert({ recipient_email: recipientEmail }));
}

// Invites the signed-in person sent, newest first.
export function listMyInvites(userId) {
  return run(
    supabase
      .from('invites')
      .select('id, recipient_email, status, created_at, responded_at')
      .eq('sender_id', userId)
      .order('created_at', { ascending: false }),
  );
}

export function cancelInvite(id) {
  return run(supabase.rpc('cancel_invite', { invite_id: id }));
}

// Pending invites to the signed-in person's email become accepted.
export function acceptMyInvites() {
  return run(supabase.rpc('accept_my_invites'));
}

// Dashboard metrics, computed live from the invites table.
export async function fetchInviteMetrics() {
  const { data, error } = await run(supabase.rpc('invite_metrics'));
  return error ? { data: null, error } : { data: (data && data[0]) || null, error: null };
}
