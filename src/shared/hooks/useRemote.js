// Loads data and tracks its state for the screen: 'loading', 'ready' or 'error'.
// A load that takes longer than `timeoutMs` counts as an error, so a slow or
// offline source never leaves a screen spinning. retry() loads again.
import { useCallback, useEffect, useState } from 'react';

export function useRemote(loader, deps = [], timeoutMs = 8000) {
  const [state, setState] = useState({ status: 'loading', data: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState({ status: 'loading', data: null });
    const timer = setTimeout(() => {
      if (alive) setState({ status: 'error', data: null, reason: 'timeout' });
      alive = false;
    }, timeoutMs);
    Promise.resolve()
      .then(loader)
      .then(({ data, error }) => {
        if (!alive) return;
        setState(error ? { status: 'error', data: null } : { status: 'ready', data });
      })
      .catch(() => alive && setState({ status: 'error', data: null }))
      .finally(() => {
        alive = false;
        clearTimeout(timer);
      });
    return () => {
      alive = false;
      clearTimeout(timer);
    };
    // loader is recreated each render; deps decide when to reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
