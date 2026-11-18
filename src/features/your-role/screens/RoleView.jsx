// PRD screen: Role view (R3, R4). A role's view: the criteria that apply, deadlines with days left, and the Do card.
export default function RoleView({
  t,
  r,
  roleId,
  days,
  open,
  onToggle,
  onChangeRole,
  onLibrary,
  actionCard,
  languageSwitch,
}) {
  return (
    <>
      <div className="ra-top">
        <button type="button" className="ra-link" onClick={onChangeRole}>
          ← {t.changeRole}
        </button>
        {languageSwitch}
      </div>
      <div className="view-head">
        <span className="eyebrow">{t.yourRole}</span>
        <h2 id="h-role" tabIndex={-1}>
          {r.name}
        </h2>
        <p className="lede">{r.blurb}</p>
      </div>
      <div className="ra-grid">
        <section className="ra-main ra-sec" aria-labelledby="ra-ap">
          <h3 id="ra-ap">{t.applies}</h3>
          <ul className="ra-crit">
            {r.items.map((it, i) => {
              const key = roleId + i;
              const isOpen = !!open[key];
              return (
                <li key={key}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    data-crit={i}
                    onClick={() => onToggle(key, i)}
                  >
                    <b>{it[0]}</b>
                    {it[1] ? <span className={'ra-tag ' + it[1]}>{t[it[1]]}</span> : <span></span>}
                    <span className="sum">{it[2]}</span>
                    <span className="hint" aria-hidden="true">
                      {isOpen ? t.hide : t.show}
                    </span>
                  </button>
                  {isOpen && <p className="det">{it[3]}</p>}
                </li>
              );
            })}
          </ul>
          <a className="ra-link" href="#resources" onClick={onLibrary}>
            {t.libLink} →
          </a>
        </section>
        <div className="ra-side">
          <section className="ra-sec" aria-labelledby="ra-wh">
            <h3 id="ra-wh">{t.byWhen}</h3>
            <ul className="ra-when">
              <li>
                <span>
                  <b>{t.y27}</b>
                  <span className="left">{t.left(days.y2027)}</span>
                </span>
                <span>{r.d27}</span>
              </li>
              <li>
                <span>
                  <b>{t.y28}</b>
                  <span className="left">{t.left(days.y2028)}</span>
                </span>
                <span>{r.d28}</span>
              </li>
            </ul>
            <p className="small muted">{r.note}</p>
          </section>
          {actionCard}
        </div>
      </div>
    </>
  );
}
