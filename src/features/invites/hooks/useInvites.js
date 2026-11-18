// State for the Invites page: the live metrics, the person's own invites, and
// sending or cancelling. Both lists reload after every change.
import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth.jsx';
import { useRemote } from '../../../shared/hooks/useRemote.js';
import {
  sendInvite,
  listMyInvites,
  cancelInvite,
  fetchInviteMetrics,
} from '../../../shared/lib/invites.js';
import { validateRecipient, inviteErrorCode } from '../logic/invites.js';

export function useInvites() {
  const auth = useAuth();
  const userId = auth.user ? auth.user.id : null;
  const [version, setVersion] = useState(0);
  const metrics = useRemote(
    () => (userId ? fetchInviteMetrics() : { data: null, error: null }),
    [userId, version],
  );
  const list = useRemote(
    () => (userId ? listMyInvites(userId) : { data: [], error: null }),
    [userId, version],
  );
  const reload = () => setVersion((n) => n + 1);

  async function send(email) {
    const invited = (list.data || [])
      .filter((i) => i.status !== 'cancelled')
      .map((i) => i.recipient_email);
    const code = validateRecipient(email, auth.user && auth.user.email, invited);
    if (code) return { ok: false, code };
    const { error } = await sendInvite(email.trim().toLowerCase());
    if (error) return { ok: false, code: inviteErrorCode(error) };
    reload();
    return { ok: true };
  }

  async function cancel(id) {
    const { data, error } = await cancelInvite(id);
    reload();
    return !error && data === true;
  }

  return {
    auth,
    metrics,
    list,
    send,
    cancel,
    refresh: reload,
    siteUrl: window.location.origin + window.location.pathname,
  };
}
