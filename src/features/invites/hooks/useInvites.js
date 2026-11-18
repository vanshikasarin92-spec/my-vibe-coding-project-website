// State for the Invites page: the live metrics, the person's own invites, and
// sending or cancelling. Both lists reload after every change.
import { useRef, useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth.jsx';
import { useRemote } from '../../../shared/hooks/useRemote.js';
import {
  sendInvite,
  listMyInvites,
  cancelInvite,
  fetchInviteMetrics,
} from '../../../shared/lib/invites.js';
import { validateRecipient, inviteErrorCode, sendOutcome } from '../logic/invites.js';

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

  // Addresses whose last send timed out or lost its connection: the invite may
  // have been saved anyway, so a duplicate on retry means it worked.
  const unsure = useRef(new Set());

  async function send(email) {
    const e = email.trim().toLowerCase();
    const invited = (list.data || [])
      .filter((i) => i.status !== 'cancelled')
      .map((i) => i.recipient_email);
    let code = validateRecipient(email, auth.user && auth.user.email, invited);
    if (!code) {
      const { error } = await sendInvite(e);
      code = error ? inviteErrorCode(error) : null;
    }
    const outcome = sendOutcome(code, unsure.current.has(e));
    if (code === 'network') {
      unsure.current.add(e);
      reload(); // the list shows the invite if it did get through
      return { ok: false, code };
    }
    unsure.current.delete(e);
    if (outcome === 'error') return { ok: false, code };
    reload();
    return { ok: true, savedEarlier: outcome === 'savedEarlier' };
  }

  // 'ok', 'gone' (no longer pending: accepted or already cancelled) or 'network'.
  async function cancel(id) {
    const { data, error } = await cancelInvite(id);
    if (error && inviteErrorCode(error) === 'network') return 'network';
    reload();
    return !error && data === true ? 'ok' : 'gone';
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
