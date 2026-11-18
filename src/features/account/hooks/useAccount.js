// State for the Account page: the form, submitting, and what's saved to the account.
import { useEffect, useState } from 'react';
import { useAuth, authActions } from '../../../shared/hooks/useAuth.jsx';
import { loadUserData } from '../../../shared/lib/userData.js';
import { validateCredentials, authErrorCode, signUpOutcome } from '../logic/credentials.js';

export function useAccount() {
  const auth = useAuth();
  const [mode, setMode] = useState('login');
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [notice, setNotice] = useState(null); // { kind: 'checkEmail', email } | { kind: 'loggedOut' }
  const [saved, setSaved] = useState({ status: 'idle', data: null });
  const [reload, setReload] = useState(0);
  const userId = auth.user ? auth.user.id : null;

  // What's saved to this account (only this person's rows; see shared/lib/userData.js).
  useEffect(() => {
    if (!userId) {
      setSaved({ status: 'idle', data: null });
      return undefined;
    }
    let alive = true;
    setSaved({ status: 'loading', data: null });
    loadUserData(userId).then(({ data, error }) => {
      if (alive) setSaved(error ? { status: 'error', data: null } : { status: 'ready', data });
    });
    return () => {
      alive = false;
    };
  }, [userId, reload]);

  async function submit(email, password) {
    setFormError(null);
    setNotice(null);
    const errors = validateCredentials(email, password, mode);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return { ok: false, invalid: true };
    setBusy(true);
    const trimmed = email.trim();
    const result =
      mode === 'signup'
        ? await authActions.signUp(trimmed, password)
        : await authActions.logIn(trimmed, password);
    setBusy(false);
    if (result.error) {
      setFormError(authErrorCode(result.error));
      return { ok: false };
    }
    if (mode === 'signup') {
      const outcome = signUpOutcome(result.data);
      if (outcome === 'exists') {
        setFormError('exists');
        return { ok: false };
      }
      if (outcome === 'checkEmail') {
        setNotice({ kind: 'checkEmail', email: trimmed });
        setMode('login');
      }
    }
    return { ok: true };
  }

  async function logOut() {
    setBusy(true);
    await authActions.logOut();
    setBusy(false);
    setNotice({ kind: 'loggedOut' });
  }

  function changeMode(next) {
    setMode(next);
    setFieldErrors({});
    setFormError(null);
  }

  const retrySaved = () => setReload((n) => n + 1);

  return {
    auth,
    mode,
    changeMode,
    busy,
    fieldErrors,
    formError,
    notice,
    saved,
    retrySaved,
    submit,
    logOut,
  };
}
