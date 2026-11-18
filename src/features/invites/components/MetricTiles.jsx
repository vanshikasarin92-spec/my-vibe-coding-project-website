import { Skeleton, ErrorState } from '../../../shared/components/StateViews.jsx';
import { metricTiles, formatTime } from '../logic/invites.js';

// Dashboard: five figures, each read live from the invites table.
export default function MetricTiles({ copy, metrics, onRefresh }) {
  return (
    <section className="ra-sec inv-dash" aria-labelledby="inv-dash-h">
      <div className="inv-dash-head">
        <h3 id="inv-dash-h">{copy.dashboardHeading}</h3>
        {metrics.status === 'ready' && metrics.data && (
          <span className="small muted">
            {copy.updated} {formatTime(metrics.data.as_of)}{' '}
            <button type="button" className="ra-link" onClick={onRefresh}>
              {copy.refresh}
            </button>
          </span>
        )}
      </div>
      {metrics.status === 'loading' && <Skeleton label={copy.metricsLoading} rows={1} lines={3} />}
      {metrics.status === 'error' && (
        <ErrorState
          message={copy.metricsError}
          onRetry={metrics.retry}
          focusAfterRetry="#inv-dash-h"
        />
      )}
      {metrics.status === 'ready' && metrics.data && (
        <dl className="inv-tiles">
          {metricTiles(metrics.data).map((t) => (
            <div key={t.id} className="inv-tile">
              <dt>{t.label}</dt>
              <dd>
                <span className="inv-value">{t.value}</span>
                <span className="inv-note">{t.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}
      <p className="small muted">{copy.dashboardNote}</p>
    </section>
  );
}
