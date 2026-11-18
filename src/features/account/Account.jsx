// Your account (#account): sign up, log in and log out with email and password,
// and see what is saved to your account. Rules in ./logic, state in ./hooks.
import { ACCOUNT_COPY as copy } from './data/copy.js';
import { RA_R } from '../your-role/data/roles.js';
import { useAccount } from './hooks/useAccount.js';
import AuthForm from './components/AuthForm.jsx';
import SavedSummary from './components/SavedSummary.jsx';
import { ErrorState } from '../../shared/components/StateViews.jsx';

export default function Account() {
  const {
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
  } = useAccount();
  const roleId = saved.data && saved.data.profile ? saved.data.profile.role_id : null;

  let body;
  if (auth.status === 'unavailable') {
    body = <p>{copy.unavailable}</p>;
  } else if (auth.status === 'error') {
    body = (
      <ErrorState message={copy.authCheckFail} onRetry={auth.retry} focusAfterRetry="#h-account" />
    );
  } else if (auth.status === 'loading') {
    body = (
      <p className="muted" aria-busy="true">
        {copy.checking}
      </p>
    );
  } else if (auth.status === 'signed-in') {
    body = (
      <>
        <p>
          {copy.signedInAs} <b>{auth.user.email}</b>
        </p>
        <SavedSummary
          copy={copy}
          saved={saved}
          roleName={roleId ? RA_R[roleId].en.name : null}
          onRetry={retrySaved}
        />
        <button type="button" className="btn" onClick={logOut} disabled={busy}>
          {copy.logOut}
        </button>
      </>
    );
  } else {
    body = (
      <AuthForm
        copy={copy}
        mode={mode}
        onModeChange={changeMode}
        busy={busy}
        fieldErrors={fieldErrors}
        formError={formError}
        onSubmit={submit}
      />
    );
  }

  return (
    <section className="view" id="v-account" aria-labelledby="h-account">
      <div className="view-head">
        <h2 id="h-account">{copy.heading}</h2>
        <p className="lede">{copy.intro}</p>
      </div>
      <p className="acc-notice" role="status">
        {notice && notice.kind === 'checkEmail' ? copy.checkEmail(notice.email) : ''}
        {notice && notice.kind === 'loggedOut' ? copy.loggedOut : ''}
      </p>
      {body}
    </section>
  );
}
