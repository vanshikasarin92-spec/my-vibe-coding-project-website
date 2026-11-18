// PRD: "What's new for the role, since the last visit" (R8), with its empty and
// error states (R9). The list comes from data, so there is no loading state.
export default function WhatsNew({ t, news, emptyMessage, onRetry }) {
  return (
    <section className="ra-sec" aria-labelledby="ra-ch">
      <h3 id="ra-ch" tabIndex={-1}>
        {t.changed}
      </h3>
      {news.status === 'error' ? (
        <div className="ra-error">
          <span>{t.loadFail}</span>
          <button type="button" className="btn" onClick={onRetry}>
            {t.retry}
          </button>
        </div>
      ) : news.items.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul className="ra-news">
          {news.items.map((n) => (
            <li key={n.title}>
              <time>{n.label}</time>
              <a href="#news" lang="en">
                {n.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
