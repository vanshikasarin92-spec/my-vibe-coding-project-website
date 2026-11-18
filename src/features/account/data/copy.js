// Account page text.

export const ACCOUNT_COPY = {
  heading: 'Your account',
  intro:
    'Sign in to keep your role, completed actions and checklist ticks across devices. An account is optional: without one, everything is saved in this browser only.',
  modes: { login: 'Log in', signup: 'Sign up' },
  modeLegend: 'I want to',
  email: 'Email',
  password: 'Password',
  passwordHint: { login: '', signup: 'At least 8 characters. Pasting and password managers work.' },
  showPassword: 'Show password',
  submit: { login: 'Log in', signup: 'Create account' },
  busy: { login: 'Logging in…', signup: 'Creating your account…' },
  retry: 'Retry',
  errorSummary: 'Fix the following:',
  authCheckFail: "We couldn't check whether you're signed in. Check your connection and try again.",
  errors: {
    emailMissing: 'Enter your email address.',
    emailFormat: 'Enter an email address like name@canadapost.ca.',
    passwordMissing: 'Enter your password.',
    passwordShort: 'Use at least 8 characters.',
    badLogin: "That email and password don't match an account. Check them, or sign up.",
    notConfirmed: 'Confirm your email first: open the link we sent you, then log in.',
    exists: 'There is already an account with that email. Log in instead.',
    weakPassword: 'Choose a longer or less common password.',
    rateLimited: 'Too many attempts. Wait a minute and try again.',
    network: "Couldn't reach the server. Check your connection and try again.",
    unknown: 'Something went wrong. Try again.',
  },
  checkEmail: (email) =>
    `Check your email. We sent a confirmation link to ${email}. Open it, then log in here.`,
  checking: 'Checking whether you are signed in…',
  unavailable:
    'Accounts are not available right now. Everything still works and is saved in this browser.',
  signedInAs: 'Signed in as',
  savedHeading: 'Saved to your account',
  savedLoading: 'Loading what is saved…',
  savedError: "Couldn't load what is saved to your account.",
  emptyTitle: 'Nothing saved yet.',
  emptyMessage:
    'Pick your role and do your first action. It will be saved here and follow you to other devices.',
  getStarted: 'Get started',
  savedRole: 'Role',
  savedNone: 'Not chosen yet',
  savedActions: 'Actions done',
  savedTicks: 'Checklist items ticked',
  privacy:
    'Only you can see these records. Each one is tied to your account and the database refuses anyone else.',
  logOut: 'Log out',
  loggedOut: 'You are logged out. Your progress stays in this browser.',
};
