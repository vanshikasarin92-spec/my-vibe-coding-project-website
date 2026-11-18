// Unit tests for sign-up and log-in rules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCredentials, authErrorCode, signUpOutcome } from './credentials.js';

test('email and password are checked before anything is sent', () => {
  assert.deepEqual(validateCredentials('', '', 'login'), {
    email: 'emailMissing',
    password: 'passwordMissing',
  });
  assert.equal(validateCredentials('name@', 'x', 'login').email, 'emailFormat');
  assert.equal(validateCredentials('a@b.ca', 'short', 'signup').password, 'passwordShort');
  assert.deepEqual(validateCredentials(' a@b.ca ', 'short', 'login'), {}); // length only on sign-up
  assert.deepEqual(validateCredentials('a@b.ca', 'long enough', 'signup'), {});
});

test('Supabase errors map to plain messages', () => {
  assert.equal(
    authErrorCode({ code: 'invalid_credentials', message: 'Invalid login credentials' }),
    'badLogin',
  );
  assert.equal(authErrorCode({ message: 'Email not confirmed' }), 'notConfirmed');
  assert.equal(authErrorCode({ message: 'User already registered' }), 'exists');
  assert.equal(
    authErrorCode({
      code: 'email_address_invalid',
      message: 'Email address "x@example.com" is invalid',
    }),
    'emailRejected',
  );
  assert.equal(authErrorCode({ message: 'Error sending confirmation email' }), 'emailNotSent');
  assert.equal(
    authErrorCode({ code: 'over_email_send_rate_limit', message: 'email rate limit exceeded' }),
    'rateLimited',
  );
  assert.equal(authErrorCode({ code: 'timeout', message: 'Network request timed out' }), 'network');
  assert.equal(authErrorCode({ status: 429, message: 'x' }), 'rateLimited');
  assert.equal(authErrorCode({ message: 'Failed to fetch' }), 'network');
  assert.equal(authErrorCode({ message: 'something else' }), 'unknown');
  assert.equal(authErrorCode(null), null);
});

test('sign-up outcome: signed in, check email, or existing account', () => {
  assert.equal(signUpOutcome({ session: { access_token: 't' }, user: {} }), 'signedIn');
  assert.equal(signUpOutcome({ session: null, user: { identities: [{ id: 1 }] } }), 'checkEmail');
  assert.equal(signUpOutcome({ session: null, user: { identities: [] } }), 'exists');
});
