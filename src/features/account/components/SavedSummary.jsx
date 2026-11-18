import { Skeleton, ErrorState, EmptyState } from '../../../shared/components/StateViews.jsx';

// What's saved to the signed-in person's account: their own rows only.
export default function SavedSummary({ copy, saved, roleName, onRetry }) {
  const data = saved.data;
  const ticked = data ? data.ticks.filter((t) => t.ticked).length : 0;
  const nothingSaved = data && !roleName && data.completions.length === 0 && ticked === 0;
  return (
    <section className="ra-sec" aria-labelledby="acc-saved">
      <h3 id="acc-saved">{copy.savedHeading}</h3>
      {saved.status === 'loading' && <Skeleton label={copy.savedLoading} rows={1} lines={3} />}
      {saved.status === 'error' && (
        <ErrorState message={copy.savedError} onRetry={onRetry} focusAfterRetry="#acc-saved" />
      )}
      {saved.status === 'ready' && nothingSaved && (
        <EmptyState
          title={copy.emptyTitle}
          message={copy.emptyMessage}
          action={{ label: copy.getStarted, href: '#role' }}
        />
      )}
      {saved.status === 'ready' && !nothingSaved && (
        <dl className="acc-saved">
          <div>
            <dt>{copy.savedRole}</dt>
            <dd>{roleName || copy.savedNone}</dd>
          </div>
          <div>
            <dt>{copy.savedActions}</dt>
            <dd>{data.completions.length}</dd>
          </div>
          <div>
            <dt>{copy.savedTicks}</dt>
            <dd>{ticked}</dd>
          </div>
        </dl>
      )}
      <p className="small muted">{copy.privacy}</p>
    </section>
  );
}
