// Every network call in the hub goes through here, so none can hang the UI.
// Two layers:
//   timedFetch: the fetch Supabase uses. Aborts a request that hasn't answered
//               in time, so the connection is freed.
//   request:    wraps a whole call (reading the reply included). Always settles
//               to { data, error } within the time limit and never throws.
// A timeout comes back as an error whose message mentions "network", so screens
// show their usual "Couldn't reach the server" message with a Retry button.

export const REQUEST_TIMEOUT_MS = 8000;

export const TIMEOUT_ERROR = Object.freeze({
  code: 'timeout',
  message: 'Network request timed out',
});

export function request(call, ms = REQUEST_TIMEOUT_MS) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ data: null, error: TIMEOUT_ERROR }), ms);
  });
  const work = Promise.resolve()
    .then(() => (typeof call === 'function' ? call() : call))
    .then(
      (res) => ({ data: res ? res.data : null, error: (res && res.error) || null }),
      (e) => ({ data: null, error: { message: (e && e.message) || 'Network error' } }),
    );
  return Promise.race([work, timeout]).finally(() => clearTimeout(timer));
}

export function timedFetch(ms = REQUEST_TIMEOUT_MS, baseFetch) {
  return (input, init = {}) => {
    const doFetch = baseFetch || globalThis.fetch;
    const ctrl = new AbortController();
    const outer = init.signal;
    if (outer) {
      if (outer.aborted) ctrl.abort();
      else outer.addEventListener('abort', () => ctrl.abort(), { once: true });
    }
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      ctrl.abort();
    }, ms);
    return doFetch(input, { ...init, signal: ctrl.signal })
      .catch((e) => {
        throw timedOut ? new TypeError(TIMEOUT_ERROR.message) : e;
      })
      .finally(() => clearTimeout(timer));
  };
}
