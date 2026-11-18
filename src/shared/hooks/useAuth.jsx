// Who is signed in. One provider at the top of the app; any page reads it with useAuth().
// status: 'loading' until Supabase has checked for a saved session, then
// 'signed-in' or 'signed-out' ('unavailable' when Supabase isn't configured,
// 'error' when the check couldn't reach the server; retry() checks again).
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { session, KEYS } from '../lib/storage.js';
import { recordVisit } from '../lib/userData.js';
import { acceptMyInvites } from '../lib/invites.js';
import { request } from '../lib/request.js';

const AuthContext = createContext({ status: 'unavailable', user: null });

export function AuthProvider({ children }) {
  const [state, setState] = useState(() =>
    supabase ? { status: 'loading', user: null } : { status: 'unavailable', user: null },
  );
  const [check, setCheck] = useState(0); // bumps on Retry

  // Follow sign-in and sign-out for as long as the app is open.
  useEffect(() => {
    if (!supabase) return undefined;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session ? session.user : null;
      setState({ status: user ? 'signed-in' : 'signed-out', user });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Check for a saved session. If that needs the network (an expired session
  // being refreshed) and the network doesn't answer in time, the status becomes
  // 'error' and pages show an inline error with Retry instead of loading forever.
  useEffect(() => {
    if (!supabase) return undefined;
    let alive = true;
    setState((s) => (s.status === 'error' ? { status: 'loading', user: null } : s));
    request(() => supabase.auth.getSession()).then(({ data, error }) => {
      if (!alive) return;
      const user = data && data.session ? data.session.user : null;
      const network =
        error && (error.code === 'timeout' || /fetch|network/i.test(error.message || ''));
      setState((s) => {
        if (s.status !== 'loading') return s; // onAuthStateChange already decided
        if (!user && network) return { status: 'error', user: null };
        return { status: user ? 'signed-in' : 'signed-out', user };
      });
    });
    return () => {
      alive = false;
    };
  }, [check]);

  // Count one visit per browser session for each signed-in person, on any page
  // (visits table; feeds the PRD's 14-day return measure).
  const userId = state.user ? state.user.id : null;
  useEffect(() => {
    if (!userId || session.get(KEYS.accountVisit) === userId) return;
    session.set(KEYS.accountVisit, userId);
    recordVisit();
    // Signing in with an invited address accepts those invites.
    acceptMyInvites();
  }, [userId]);

  const value = { ...state, retry: () => setCheck((n) => n + 1) };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

// Sign-up, log-in and log-out. Each resolves to { data, error } and never throws.
// Settles within the time limit, so a form never stays on "Signing in…".
function call(fn) {
  if (!supabase)
    return Promise.resolve({ data: null, error: { message: 'Supabase is not configured.' } });
  return request(fn);
}

export const authActions = {
  signUp: (email, password) =>
    call(() =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname + '#account',
        },
      }),
    ),
  logIn: (email, password) => call(() => supabase.auth.signInWithPassword({ email, password })),
  logOut: () => call(() => supabase.auth.signOut()),
};
