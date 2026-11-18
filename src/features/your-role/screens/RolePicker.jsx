// PRD screen: Role picker (R1). First screen: "What's your role?" with six role cards and the ACA countdown.
export default function RolePicker({ t, roles, daysLeft, onPick, languageSwitch }) {
  return (
    <>
      <div className="ra-top">
        <span className="eyebrow">{t.kicker}</span>
        {languageSwitch}
      </div>
      <div className="ra-count">
        <span className="num">{daysLeft}</span>
        <span className="txt">
          <b>{t.countdown}</b>
          <span>{t.countdownSub}</span>
        </span>
      </div>
      <div className="view-head">
        <h2 id="h-role" tabIndex={-1}>
          {t.ask}
        </h2>
        <p className="lede">{t.askSub}</p>
      </div>
      <ul className="ra-roles">
        {roles.map((x) => (
          <li key={x.id}>
            <button type="button" className="ra-role" onClick={() => onPick(x.id)}>
              <b>{x.name}</b>
              <span>{x.blurb}</span>
              <span className="arr" aria-hidden="true">
                →
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="small muted">{t.remember}</p>
    </>
  );
}
