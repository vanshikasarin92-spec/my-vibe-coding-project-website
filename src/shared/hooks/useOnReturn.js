// Calls `fn` when the person comes back to this tab (it becomes visible or focused),
// so edits made in another tab or on another device show up here.
import { useEffect, useRef } from 'react';

export function useOnReturn(fn, enabled) {
  const latest = useRef(fn);
  latest.current = fn;
  useEffect(() => {
    if (!enabled) return undefined;
    let last = 0;
    const run = () => {
      if (document.visibilityState !== 'visible') return;
      const now = performance.now();
      if (now - last < 2000) return; // focus and visibilitychange often fire together
      last = now;
      latest.current();
    };
    window.addEventListener('focus', run);
    document.addEventListener('visibilitychange', run);
    return () => {
      window.removeEventListener('focus', run);
      document.removeEventListener('visibilitychange', run);
    };
  }, [enabled]);
}
