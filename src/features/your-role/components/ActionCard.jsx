import { nextStep } from '../logic/profile.js';

// Card on Role view and Welcome back that offers "Do this now", then "Do this next" (R5, R6). onReturn: shown on the Welcome back screen,
// where the done line is already in "Since your last visit".
export default function ActionCard({ t, r, acts, onReturn, onStart, fmt }) {
  const step = nextStep(acts);

  if (step === 'do') {
    return (
      <section className="ra-do" aria-labelledby="ra-do-h">
        <h3 id="ra-do-h" className="ra-k">
          {onReturn ? t.doNext : t.doNow}
        </h3>
        <p className="t">{r.doTitle}</p>
        <p>{r.doSub}</p>
        <button type="button" className="btn primary" onClick={() => onStart('do')}>
          {r.doBtn}
        </button>
      </section>
    );
  }

  const doneLine = onReturn ? null : (
    <div className="ra-ok">
      <span className="small">
        <b>{t.doneOn(fmt(acts.do))}</b>
      </span>
      <span>{r.doTitle}</span>
    </div>
  );

  if (step === 'next') {
    return (
      <>
        {doneLine}
        <section className="ra-do" aria-labelledby="ra-do-h">
          <h3 id="ra-do-h" className="ra-k">
            {t.doNext}
          </h3>
          <p className="t">{r.nx.title}</p>
          <p>{r.nx.sub}</p>
          <button type="button" className="btn primary" onClick={() => onStart('next')}>
            {r.nx.btn}
          </button>
        </section>
      </>
    );
  }

  return (
    <>
      {doneLine}
      <div className="ra-ok">
        <b>{t.allDone}</b>
        <span className="small">{t.allDoneSub}</span>
      </div>
    </>
  );
}
