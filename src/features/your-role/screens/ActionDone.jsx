// Action done: confirmation after Do this now or Do this next is marked done.
// Not named in the PRD; R5 and R6 only say the action is saved as done.
export default function ActionDone({ t, r, kind, onBack, languageSwitch }) {
  const isDo = kind === 'do';
  return (
    <>
      <div className="ra-top">
        <span className="eyebrow">{r.name}</span>
        {languageSwitch}
      </div>
      <div className="ra-ok">
        <span className="small">
          <b>{t.doneLabel}</b>
        </span>
        <h2 id="h-role" tabIndex={-1}>
          {isDo ? r.done.title : r.nx.doneTitle}
        </h2>
        <p>{isDo ? r.done.body : r.nx.doneBody}</p>
      </div>
      {isDo && (
        <div className="ra-sec">
          <h3>{t.next}</h3>
          <ul className="list">
            {r.done.next.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      <button type="button" className="btn" onClick={onBack}>
        {t.backToView}
      </button>
    </>
  );
}
