// Sign-up and log-in rules. Pure functions: no React, no network.

export const MIN_PASSWORD = 8;

// Returns { email?: code, password?: code }; empty object = valid.
export function validateCredentials(email, password, mode) {
  const errors = {};
  const e = email.trim();
  if (!e) errors.email = 'emailMissing';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) errors.email = 'emailFormat';
  if (!password) errors.password = 'passwordMissing';
  else if (mode === 'signup' && password.length < MIN_PASSWORD) errors.password = 'passwordShort';
  return errors;
}

// Turns a Supabase Auth error into one of our message codes.
export function authErrorCode(error) {
  if (!error) return null;
  const code = error.code || '';
  const msg = (error.message || '').toLowerCase();
  if (code === 'timeout') return 'network';
  if (code === 'invalid_credentials' || msg.includes('invalid login credentials'))
    return 'badLogin';
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) return 'notConfirmed';
  if (code === 'user_already_exists' || msg.includes('already registered')) return 'exists';
  if (code === 'email_address_invalid' || msg.includes('is invalid')) return 'emailRejected';
  if (
    code === 'email_address_not_authorized' ||
    msg.includes('sending confirmation email') ||
    msg.includes('not authorized')
  )
    return 'emailNotSent';
  if (code === 'weak_password' || msg.includes('password should')) return 'weakPassword';
  if (error.status === 429 || code.includes('rate_limit') || msg.includes('rate limit'))
    return 'rateLimited';
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('not configured'))
    return 'network';
  return 'unknown';
}

// After sign-up: a session means the account is ready; no session means the
// person must confirm their email first.
export function signUpOutcome(data) {
  if (data && data.session) return 'signedIn';
  if (
    data &&
    data.user &&
    Array.isArray(data.user.identities) &&
    data.user.identities.length === 0
  ) {
    return 'exists'; // Supabase hides existing accounts this way when email confirmation is on.
  }
  return 'checkEmail';
}
