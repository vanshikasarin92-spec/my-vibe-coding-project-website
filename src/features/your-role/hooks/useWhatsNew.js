// What's new for a role since a date, for the Welcome back screen.
// Works without signing in: the last visit comes from this browser (see
// logic/profile.js). The list starts from the news bundled with the hub, so it
// shows at once, then switches to the live news in Supabase when that arrives,
// so items the team publishes later appear too. If Supabase can't be reached
// the bundled list stays. status is 'error' only if building the list fails;
// retry() rebuilds it and asks Supabase again.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NEWS } from '../../news/data/news.js';
import { newsFromRows } from '../../news/logic/fromRows.js';
import { fetchNews } from '../../../shared/lib/content.js';
import { supabase } from '../../../shared/lib/supabase.js';
import { RA_TOPIC } from '../data/roles.js';
import { whatsNewFor } from '../logic/whatsNew.js';

export function useWhatsNew(roleId, since) {
  const [attempt, setAttempt] = useState(0);
  const [live, setLive] = useState(null);
  const wanted = Boolean(roleId && since);

  useEffect(() => {
    if (!wanted || !supabase) return undefined;
    let alive = true;
    fetchNews().then(({ data, error }) => {
      if (alive && !error && Array.isArray(data) && data.length) setLive(newsFromRows(data));
    });
    return () => {
      alive = false;
    };
  }, [wanted, attempt]);

  const result = useMemo(() => {
    if (!wanted) return { status: 'ready', items: [], source: 'none' };
    try {
      return {
        status: 'ready',
        items: whatsNewFor(live || NEWS, RA_TOPIC, roleId, since),
        source: live ? 'live' : 'bundled',
      };
    } catch (e) {
      return { status: 'error', items: [], source: 'none' };
    }
  }, [wanted, roleId, since, live]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...result, retry };
}
