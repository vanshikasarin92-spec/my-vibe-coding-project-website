// Analytics (#analytics): visitors, page views, views per visit, visit duration
// and bounce rate, read live from the anonymous page_views table.
// Text in ./data, rules in ./logic, state in ./hooks.
import { useRef, useState } from 'react';
import { ANALYTICS_COPY as copy } from './data/copy.js';
import { useAnalytics } from './hooks/useAnalytics.js';
import { RANGES, isEmpty, formatTime } from './logic/analytics.js';
import { ROUTES, EXTRA_ROUTES } from '../../shared/data/routes.js';
import KpiTiles from './components/KpiTiles.jsx';
import TrendChart from './components/TrendChart.jsx';
import TopPages from './components/TopPages.jsx';
import { EmptyState, Skeleton, ErrorState } from '../../shared/components/StateViews.jsx';

export default function Analytics() {
  const { auth, days, setDays, figures, refresh, siteUrl, copyLink } = useAnalytics();
  const linkRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState('');

  let body;
  if (auth.status === 'unavailable') {
    body = <p>{copy.unavailable}</p>;
  } else if (auth.status === 'error') {
    body = (
      <ErrorState
        message={copy.authCheckFail}
        onRetry={auth.retry}
        focusAfterRetry="#h-analytics"
      />
    );
  } else if (auth.status === 'loading') {
    body = <Skeleton label={copy.checking} rows={1} lines={3} />;
  } else if (auth.status !== 'signed-in') {
    body = (
      <EmptyState
        title={copy.signedOutTitle}
        message={copy.signedOutMessage}
        action={{ label: copy.getStarted, href: '#account' }}
      />
    );
  } else {
    const data = figures.data;
    let results;
    if (figures.status === 'loading') {
      results = <Skeleton label={copy.loading} rows={3} lines={3} />;
    } else if (figures.status === 'error' || !data) {
      results = (
        <ErrorState message={copy.error} onRetry={figures.retry} focusAfterRetry="#h-analytics" />
      );
    } else if (isEmpty(data)) {
      results = (
        <>
          <EmptyState
            title={copy.emptyTitle(days)}
            message={copy.emptyMessage}
            action={{
              label: copy.copyLink,
              onClick: () =>
                copyLink(linkRef.current).then((ok) =>
                  setCopyStatus(ok ? copy.copied : copy.copyFailed),
                ),
            }}
            secondary={days < 90 ? { label: copy.showLonger, onClick: () => setDays(90) } : null}
          />
          <p className="small">
            <code ref={linkRef} className="an-link">
              {siteUrl}
            </code>
          </p>
          <p className="ra-status" role="status">
            {copyStatus}
          </p>
        </>
      );
    } else {
      results = (
        <>
          <KpiTiles copy={copy} data={data} />
          <TrendChart copy={copy} series={data.series} days={data.days} />
          <TopPages copy={copy} pages={data.pages} routes={[...ROUTES, ...EXTRA_ROUTES]} />
        </>
      );
    }
    body = (
      <>
        <div className="an-toolbar">
          <div className="toggles an-range" role="group" aria-label={copy.rangeLabel}>
            {RANGES.map((d) => (
              <button
                key={d}
                type="button"
                className="toggle"
                aria-pressed={days === d}
                onClick={() => setDays(d)}
              >
                {copy.rangeOption(d)}
              </button>
            ))}
          </div>
          {figures.status === 'ready' && data && (
            <span className="small muted">
              {copy.updated} {formatTime(data.as_of)}{' '}
              <button type="button" className="ra-link" onClick={refresh}>
                {copy.refresh}
              </button>
            </span>
          )}
        </div>
        {results}
        <details className="an-how">
          <summary>{copy.howHeading}</summary>
          <dl>
            {copy.how.map(([term, text]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <p className="small muted">{copy.tz}</p>
        </details>
      </>
    );
  }

  return (
    <section className="view" id="v-analytics" aria-labelledby="h-analytics">
      <div className="view-head">
        <h2 id="h-analytics">{copy.heading}</h2>
        <p className="lede">{copy.intro}</p>
      </div>
      {body}
    </section>
  );
}
