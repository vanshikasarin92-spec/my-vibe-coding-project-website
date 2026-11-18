import { useEffect, useRef, useState } from 'react';

// Email and password form for log-in and sign-up. Errors are listed in a summary
// that takes focus, and each field points to its own message (WCAG 3.3.1, 3.3.3).
// Paste and password managers work (WCAG 3.3.8).
export default function AuthForm({
  copy,
  mode,
  onModeChange,
  busy,
  fieldErrors,
  formError,
  onSubmit,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const summaryRef = useRef(null);
  const [attempt, setAttempt] = useState(0); // bumps on each failed submit

  const messages = [
    fieldErrors.email && { id: 'acc-email', text: copy.errors[fieldErrors.email] },
    fieldErrors.password && { id: 'acc-password', text: copy.errors[fieldErrors.password] },
    formError && { id: null, text: copy.errors[formError] },
  ].filter(Boolean);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await onSubmit(email, password);
    if (!result.ok) setAttempt((n) => n + 1);
  }

  // After a failed submit, move focus to the error summary once it is on screen.
  useEffect(() => {
    if (attempt && summaryRef.current) summaryRef.current.focus();
  }, [attempt]);

  const hint = copy.passwordHint[mode];
  const describedPassword =
    [hint && 'acc-password-hint', fieldErrors.password && 'acc-password-error']
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <form className="acc-form" onSubmit={handleSubmit} noValidate aria-busy={busy}>
      <fieldset className="fieldset">
        <legend>{copy.modeLegend}</legend>
        <div className="toggles">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              className="toggle"
              aria-pressed={mode === m}
              onClick={() => onModeChange(m)}
            >
              {copy.modes[m]}
            </button>
          ))}
        </div>
      </fieldset>

      {messages.length > 0 && (
        <div className="acc-errors" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>
            <b>{copy.errorSummary}</b>
          </p>
          <ul>
            {messages.map((m) => (
              <li key={m.text}>{m.id ? <a href={'#' + m.id}>{m.text}</a> : m.text}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="acc-field">
        <label htmlFor="acc-email">{copy.email}</label>
        <input
          id="acc-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? 'acc-email-error' : undefined}
        />
        {fieldErrors.email && (
          <span className="acc-error" id="acc-email-error">
            {copy.errors[fieldErrors.email]}
          </span>
        )}
      </div>

      <div className="acc-field">
        <label htmlFor="acc-password">{copy.password}</label>
        {hint && (
          <span className="acc-hint" id="acc-password-hint">
            {hint}
          </span>
        )}
        <input
          id="acc-password"
          type={show ? 'text' : 'password'}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={fieldErrors.password ? true : undefined}
          aria-describedby={describedPassword}
        />
        {fieldErrors.password && (
          <span className="acc-error" id="acc-password-error">
            {copy.errors[fieldErrors.password]}
          </span>
        )}
        <label className="acc-check">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
          {copy.showPassword}
        </label>
      </div>

      <button type="submit" className="btn primary" disabled={busy}>
        {busy ? copy.busy[mode] : copy.submit[mode]}
      </button>
    </form>
  );
}
