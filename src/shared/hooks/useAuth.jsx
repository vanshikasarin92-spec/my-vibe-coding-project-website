// Who is signed in. One provider at the top of the app; any page reads it with useAuth().
// status: 'loading' until Supabase has checked for a saved session, then
// 'signed-in' or 'signed-out' ('unavailable' when Supabase isn't configured).
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext({ status: 'unavailable', user: null });

export function AuthProvider({ children }) {
  const [state, setState] = useState(() =>
    supabase ? { status: 'loading', user: null } : { status: 'unavailable', user: null },
  );

  useEffect(() => {
    if (!supabase) return undefined;
    let alive = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!alive) return;
        const user = data.session ? data.session.user : null;
        setState({ status: user ? 'signed-in' : 'signed-out', user });
      })
      .catch(() => alive && setState({ status: 'signed-out', user: null }));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session ? session.user : null;
      setState({ status: user ? 'signed-in' : 'signed-out', user });
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

// Sign-up, log-in and log-out. Each resolves to { data, error } and never throws.
async function call(fn) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } };
  try {
    return await fn();
  } catch (e) {
    return { data: null, error: { message: e.message || 'Network error' } };
  }
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
