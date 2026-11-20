// State for the Analytics page: the chosen period and the live figures for it.
import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth.jsx';
import { useRemote } from '../../../shared/hooks/useRemote.js';
import { fetchSiteAnalytics } from '../../../shared/lib/analytics.js';
import { copyText } from '../../../shared/lib/clipboard.js';

export function useAnalytics() {
  const auth = useAuth();
  const signedIn = auth.status === 'signed-in';
  const [days, setDays] = useState(30);
  const [version, setVersion] = useState(0);
  const figures = useRemote(
    () => (signedIn ? fetchSiteAnalytics(days) : { data: null, error: null }),
    [signedIn, days, version],
  );
  const siteUrl = window.location.origin + window.location.pathname;
  return {
    auth,
    days,
    setDays,
    figures,
    refresh: () => setVersion((n) => n + 1),
    siteUrl,
    copyLink: (node) => copyText(siteUrl, node),
  };
}
