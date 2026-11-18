// Latest news with a topic filter and pagination. Items load from Supabase
// (./hooks/useNewsData) with loading, error and empty states; filter rule in ./logic.

import { useState } from 'react';
import { NEWS_FILTERS } from './data/news.js';
import { newsByTopic } from './logic/filterNews.js';
import { useNewsData } from './hooks/useNewsData.js';
import { paginate, pageNumbers } from '../../shared/logic/paginate.js';
import {
  Skeleton,
  ErrorState,
  EmptyState,
  Pagination,
} from '../../shared/components/StateViews.jsx';

const PAGE_SIZE = 5;

export default function News() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const news = useNewsData();

  const all = news.status === 'ready' ? news.data : [];
  const p = paginate(newsByTopic(all, filter), page, PAGE_SIZE);
  const topicLabel = (NEWS_FILTERS.find((f) => f.id === filter) || {}).label;

  let body;
  if (news.status === 'loading') {
    body = <Skeleton label="Loading news…" rows={PAGE_SIZE} lines={3} />;
  } else if (news.status === 'error') {
    body = (
      <ErrorState
        message="We couldn't load the latest news. Check your connection and try again."
        onRetry={news.retry}
        focusAfterRetry="#h-news"
      />
    );
  } else if (all.length === 0) {
    body = (
      <EmptyState
        title="No news has been published yet."
        message="Start with what applies to your role: the requirements, the deadline and one thing to do this sprint."
        action={{ label: 'Get started', href: '#role' }}
      />
    );
  } else if (p.total === 0) {
    body = (
      <EmptyState
        title={`No news on ${topicLabel} yet.`}
        message="See every topic, or get started with what applies to your role."
        action={{ label: 'Get started', href: '#role' }}
        secondary={{ label: 'Show all topics', onClick: () => setFilter('all') }}
      />
    );
  } else {
    body = (
      <>
        <ol className="news" id="news-list">
          {p.items.map((n) => (
            <li key={n.date + n.title} data-topic={n.topic}>
              <time dateTime={n.date}>{n.label}</time>
              <div className="body">
                <span className="tag">{n.tag}</span>
                <h3>{n.title}</h3>
                <p className="small">{n.body}</p>
                <p className="means">
                  <b>{n.meansLead}</b> {n.means}
                </p>
                <p className="src-line">
                  {n.sourcesLabel}{' '}
                  {n.sources.map((s, i) => (
                    <span key={s.href}>
                      {i > 0 && ' · '}
                      <a href={s.href}>{s.label}</a>
                    </span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <Pagination
          label="News pages"
          page={p.page}
          pages={p.pages}
          numbers={pageNumbers(p.page, p.pages)}
          from={p.from}
          to={p.to}
          total={p.total}
          onChange={setPage}
          focusOnChange="#h-news"
        />
      </>
    );
  }

  return (
    <section className="view" id="v-news" aria-labelledby="h-news">
      <div className="view-head">
        <h2 id="h-news">Latest news</h2>
        <p className="lede">
          The developments from the past year that change how we design, build or test. Newest
          first.
        </p>
      </div>

      <div className="toggles" role="group" aria-label="Filter news by topic">
        {NEWS_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="toggle"
            aria-pressed={filter === f.id}
            onClick={() => {
              setFilter(f.id);
              setPage(1);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {body}
    </section>
  );
}
