import WhatsNew from '../components/WhatsNew.jsx';

// PRD screen: Return visit, "Welcome back" (R7). What was done since the last
// visit, What's new for the role, the next step and the countdown.
export default function WelcomeBack({
  t,
  r,
  acts,
  prevVisit,
  news,
  emptyMessage,
  daysLeft,
  fewerDays,
  fmt,
  onChangeRole,
  onRetry,
  onRequirements,
  actionCard,
  languageSwitch,
}) {
  return (
    <>
      <div className="ra-top">
        <div className="view-head">
          <span className="eyebrow">{t.welcome}</span>
          <h2 id="h-role" tabIndex={-1}>
            {r.name}
          </h2>
        </div>
        <span className="ra-top-actions">
          <button type="button" className="ra-link" onClick={onChangeRole}>
            {t.notYou}
          </button>
          {languageSwitch}
        </span>
      </div>
      <div className="ra-grid">
        <div className="ra-main">
          <section className="ra-sec" aria-labelledby="ra-sl">
            <h3 id="ra-sl">
              {t.sinceLast} · {fmt(prevVisit)}
            </h3>
            {acts.do ? (
              <>
                <div className="ra-ok">
                  <span className="small">
                    <b>{t.doneOn(fmt(acts.do))}</b>
                  </span>
                  <span>{r.doTitle}</span>
                </div>
                {acts.next && (
                  <div className="ra-ok">
                    <span className="small">
                      <b>{t.doneOn(fmt(acts.next))}</b>
                    </span>
                    <span>{r.nx.title}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="ra-pending">
                <span>
                  <b className="small">{t.lastNot}</b>
                  <span>{r.doTitle}</span>
                </span>
              </div>
            )}
          </section>
          <WhatsNew t={t} news={news} emptyMessage={emptyMessage} onRetry={onRetry} />
          {actionCard}
          <button type="button" className="ra-alt" onClick={onRequirements}>
            {t.yourReqs} →
          </button>
        </div>
        <div className="ra-side">
          <div className="ra-count">
            <span className="num">{daysLeft}</span>
            <span className="txt">
              <b>{t.daysTo}</b>
              <span>{fewerDays > 0 ? t.fewer(fewerDays) : ''}</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
