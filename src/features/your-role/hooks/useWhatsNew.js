import { useCallback, useMemo, useState } from 'react';
import { NEWS } from '../../news/data/news.js';
import { RA_TOPIC } from '../data/roles.js';
import { whatsNewFor } from '../logic/whatsNew.js';

// What's new for a role since a date. The list comes from static data, so it is
// ready at once; status is 'error' only if building it fails. retry() rebuilds it.
export function useWhatsNew(roleId, since) {
  const [attempt, setAttempt] = useState(0);
  const result = useMemo(() => {
    if (!roleId || !since) return { status: 'ready', items: [] };
    try {
      return {
        status: 'ready',
        items: whatsNewFor(NEWS, RA_TOPIC, roleId, since),
      };
    } catch (e) {
      return { status: 'error', items: [] };
    }
    // attempt is a dependency so retry() recomputes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId, since, attempt]);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...result, retry };
}
