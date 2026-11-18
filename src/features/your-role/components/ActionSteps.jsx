// Shared layout for the Do this now and Do this next screens: steps, optional
// text to copy, and the done button.
export default function ActionSteps({
  eyebrow,
  title,
  action,
  backLabel,
  copyText,
  copyLang,
  status,
  preRef,
  onBack,
  onCopy,
  onFinish,
  languageSwitch,
}) {
  return (
    <>
      <div className="ra-top">
        <button type="button" className="ra-link" onClick={onBack}>
          ← {backLabel}
        </button>
        {languageSwitch}
      </div>
      <div className="view-head">
        <span className="ra-k">{eyebrow}</span>
        <h2 id="h-role" tabIndex={-1}>
          {title}
        </h2>
        <p className="lede">{action.intro}</p>
      </div>
      <ol className="list">
        {action.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {copyText && (
        <div className="ra-sec">
          <h3 id="ra-cp" className="small">
            {action.copyHeading}
          </h3>
          <pre ref={preRef} className="ra-pre" aria-labelledby="ra-cp" lang={copyLang}>
            {copyText}
          </pre>
        </div>
      )}
      <div className="btn-group">
        {copyText && (
          <button type="button" className="btn" onClick={() => onCopy(copyText)}>
            {action.copyBtn}
          </button>
        )}
        <button type="button" className="btn primary" onClick={onFinish}>
          {action.doneBtn}
        </button>
        <span className="ra-status" role="status">
          {status}
        </span>
      </div>
    </>
  );
}
