import { kpiTiles } from '../logic/analytics.js';

// The five headline figures, each with how it moved against the previous period.
export default function KpiTiles({ copy, data }) {
  return (
    <section className="ra-sec" aria-labelledby="an-tiles-h">
      <h3 id="an-tiles-h" className="vh">
        {copy.tilesHeading}
      </h3>
      <dl className="inv-tiles an-tiles">
        {kpiTiles(data).map((t) => (
          <div key={t.id} className="inv-tile" data-tile={t.id}>
            <dt>{t.label}</dt>
            <dd>
              <span className="inv-value">{t.value}</span>
              <span className="inv-note">{t.note}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
