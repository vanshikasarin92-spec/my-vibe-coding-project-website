// Standards & law: Accessible Canada Act panel, standards table, WCAG 2.2 additions, target sizes.

import { Fragment } from 'react';
import {
  ACA_CHECKED,
  ACA_LAYERS,
  FACT_CHECK,
  TIMELINE,
  ORG_PLAN,
  WHICH_DEADLINE,
  STANDARDS,
  WCAG22_ADDED,
  TARGET_SIZES,
} from './data/standards.js';
import RichText from '../../shared/components/RichText.jsx';

export default function Standards() {
  return (
    <section className="view" id="v-standards" aria-labelledby="h-standards">
      <div className="view-head">
        <h2 id="h-standards">Standards, laws and requirements</h2>
        <p className="lede">
          Technical standards say <em>how</em> to make something accessible. Laws and regulations
          say <em>who must</em>. In Canada, the federal law points to CAN/ASC-EN 301 549, which in
          turn points to WCAG.
        </p>
      </div>

      <section className="ca-panel" aria-labelledby="h-aca">
        <header>
          <span className="eyebrow">Canada</span>
          <h3 id="h-aca">Accessible Canada Act: what applies to digital products</h3>
          <p className="small muted">{ACA_CHECKED}</p>
        </header>
        <div className="layers">
          {ACA_LAYERS.map((l) => (
            <div key={l.name} className="layer">
              <span className="k">{l.kicker}</span>
              <b>{l.name}</b>
              <p>{l.text}</p>
            </div>
          ))}
        </div>
        <div className="factcheck">
          <h4>{FACT_CHECK.heading}</h4>
          <ul>
            {FACT_CHECK.points.map((p) => (
              <li key={p}>
                <RichText text={p} />
              </li>
            ))}
          </ul>
        </div>
        <div className="block">
          <h4>Digital compliance timeline</h4>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Deadline</th>
                  <th scope="col">Requirement</th>
                  {TIMELINE.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIMELINE.rows.map((row) => (
                  <tr key={row.date + row.requirement}>
                    <th scope="row" className="num">
                      {row.date}
                    </th>
                    <td>{row.requirement}</td>
                    {row.applies.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted">{TIMELINE.note}</p>
        </div>
        <div className="org-plan">
          <div className="block">
            <h4>{ORG_PLAN.heading}</h4>
            <ul className="list">
              {ORG_PLAN.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="xs muted">
              Source:{' '}
              {ORG_PLAN.sources.map((s, i) => (
                <Fragment key={s.href}>
                  {i > 0 && ' · '}
                  <a href={s.href}>{s.label}</a>
                </Fragment>
              ))}
            </p>
          </div>
          <div className="block">
            <h4>{WHICH_DEADLINE.heading}</h4>
            <p className="small">{WHICH_DEADLINE.text}</p>
            <p className="small">
              Accessibility feedback:{' '}
              {WHICH_DEADLINE.feedbackEmails.map((e, i) => (
                <Fragment key={e}>
                  {i > 0 && ' · '}
                  <span className="selectable">{e}</span>
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </section>

      <div className="tablewrap">
        <table>
          <caption>{STANDARDS.caption}</caption>
          <thead>
            <tr>
              <th scope="col">Requirement</th>
              <th scope="col">What it is</th>
              <th scope="col">Status</th>
              <th scope="col">Technical bar</th>
              <th scope="col">Applies to</th>
            </tr>
          </thead>
          <tbody>
            {STANDARDS.rows.map((s) => (
              <tr key={s.name} className={s.ca ? 'ca' : undefined}>
                <th scope="row">
                  <a href={s.href}>{s.name}</a>
                </th>
                <td>{s.what}</td>
                <td>
                  <span className={'status st-' + s.level}>{s.status}</span>
                </td>
                <td>{s.bar}</td>
                <td>{s.applies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="callout">
        Orientation, not legal advice. Coverage depends on the organisation's category under the
        ACA, where products are sold and to whom. Confirm with Legal and the Accessibility office
        before making conformance claims.
      </p>

      <div className="block">
        <h3>What WCAG 2.2 added over 2.1</h3>
        <p className="small muted prose">{WCAG22_ADDED.note}</p>
        <div className="criteria">
          {WCAG22_ADDED.criteria.map((c) => (
            <div key={c.sc} className="crit-card">
              <span className="sc">{c.sc}</span>
              <b>{c.name}</b>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="block">
        <h3>Minimum touch target sizes across platforms</h3>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Source</th>
                <th scope="col">Minimum</th>
                <th scope="col">Unit</th>
                <th scope="col">Type</th>
              </tr>
            </thead>
            <tbody>
              {TARGET_SIZES.rows.map((row) => (
                <tr key={row.source}>
                  <th scope="row">{row.source}</th>
                  <td className="num">{row.min}</td>
                  <td>{row.unit}</td>
                  <td>{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted">{TARGET_SIZES.rule}</p>
      </div>
    </section>
  );
}
