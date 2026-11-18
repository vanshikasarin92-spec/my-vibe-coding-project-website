import { useEffect, useState } from 'react';
import { viewFromHash } from '../logic/navigation.js';

// The current page id from the URL hash (#role, #news, …), updated on hashchange.
export function useHashRoute(routeIds, fallback) {
  const read = () => viewFromHash(window.location.hash, routeIds, fallback);
  const [view, setView] = useState(read);
  useEffect(() => {
    const onHash = () => setView(read());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
    // routeIds and fallback are constants from routes.js.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return view;
}
