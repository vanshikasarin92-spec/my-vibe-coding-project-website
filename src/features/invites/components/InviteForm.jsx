import { useEffect, useRef, useState } from 'react';
import { copyText } from '../../../shared/lib/clipboard.js';

// Invite form, then the message to send yourself (the hub doesn't email invites).
export default function InviteForm({ copy, onSend, siteUrl }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [sentTo, setSentTo] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [attempt, setAttempt] = useState(0);
  const inputRef = useRef(null);
  const msgRef = useRef(null);

  // After a failed send, return focus to the field so the error is read with it.
  useEffect(() => {
    if (attempt && inputRef.current) inputRef.current.focus();
  }, [attempt]);

  // One send at a time: rapid clicks or Enter presses while a send is in
  // flight are ignored (the database also refuses a second active invite).
  const inFlight = useRef(false);

  async function submit(e) {
    if (e) e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setCopyStatus('');
    const res = await onSend(email);
    inFlight.current = false;
    setBusy(false);
    if (res.ok) {
      setError(null);
      setSentTo(email.trim().toLowerCase());
      setEmail('');
    } else {
      setError(res.code);
      setSentTo(null);
      setAttempt((n) => n + 1);
    }
  }

  const message = copy.shareText(siteUrl);
  return (
    <section className="ra-sec" aria-labelledby="inv-form-h">
      <h3 id="inv-form-h">{copy.formHeading}</h3>
      <form className="acc-form" onSubmit={submit} noValidate aria-busy={busy}>
        <div className="acc-field">
          <label htmlFor="inv-email">{copy.emailLabel}</label>
          <span className="acc-hint" id="inv-email-hint">
            {copy.emailHint}
          </span>
          <input
            id="inv-email"
            ref={inputRef}
            type="email"
            autoComplete="off"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'inv-email-hint inv-email-error' : 'inv-email-hint'}
          />
          {error && (
            <span className="acc-error" id="inv-email-error">
              {copy.errors[error] || copy.errors.unknown}
            </span>
          )}
          {error === 'network' && (
            <button type="button" className="btn" onClick={() => submit()} disabled={busy}>
              {copy.retry}
            </button>
          )}
        </div>
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? copy.sending : copy.send}
        </button>
      </form>
      <p className="acc-notice" role="status">
        {sentTo ? copy.sent(sentTo) : ''}
      </p>
      {sentTo && (
        <div className="inv-share">
          <h4 id="inv-share-h">{copy.shareHeading}</h4>
          <p className="small muted">{copy.shareNote}</p>
          <pre ref={msgRef} className="ra-pre" aria-labelledby="inv-share-h">
            {message}
          </pre>
          <div className="btn-group">
            <button
              type="button"
              className="btn"
              onClick={() =>
                copyText(message, msgRef.current).then((ok) =>
                  setCopyStatus(ok ? copy.copied : copy.copyFail),
                )
              }
            >
              {copy.copy}
            </button>
            <span className="ra-status" role="status">
              {copyStatus}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
