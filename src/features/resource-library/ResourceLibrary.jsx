// PRD R13: Resource library with role filter, keyword search and pagination, opened
// on the role chosen in Your role. Resources load from Supabase
// (./hooks/useResourceData) with loading, error and empty states; rules in ./logic.

import { useState } from 'react';
import { ROLES, SHORT } from './data/resources.js';
import { useLibraryRole } from './hooks/useLibraryRole.js';
import { useResourceData } from './hooks/useResourceData.js';
import {
  resourceCount,
  filterResources,
  hitCount,
  flattenHits,
  regroup,
} from './logic/filterResources.js';
import { paginate, pageNumbers } from '../../shared/logic/paginate.js';
import {
  Skeleton,
  ErrorState,
  EmptyState,
  Pagination,
} from '../../shared/components/StateViews.jsx';

const LABEL = Object.fromEntries(ROLES.map((r) => [r.id, r.label]));
const PAGE_SIZE = 10;

export default function ResourceLibrary() {
  // The Your role page sets this too, so the library opens filtered to your role.
  const [role, pickRole] = useLibraryRole((v) => !!LABEL[v]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const res = useResourceData();

  const ready = res.status === 'ready';
  const all = ready ? res.data : [];
  const q = query.trim();
  const groups = filterResources(all, role, query, LABEL);
  const total = hitCount(groups);
  const groupTotals = Object.fromEntries(groups.map((g) => [g.g, g.hits.length]));
  const p = paginate(flattenHits(groups), page, PAGE_SIZE);
  const pageGroups = regroup(p.items);
  const current = ROLES.find((r) => r.id === role);

  function pick(id) {
    pickRole(id);
    setPage(1);
  }
  function clearFilters() {
    setQuery('');
    pick('all');
  }

  let body;
  if (res.status === 'loading') {
    body = <Skeleton label="Loading resources…" rows={6} lines={2} />;
  } else if (res.status === 'error') {
    body = (
      <ErrorState
        message="We couldn't load the resource library. Check your connection and try again."
        onRetry={res.retry}
        focusAfterRetry="#h-resources"
      />
    );
  } else if (all.length === 0) {
    body = (
      <EmptyState
        title="The library has no resources yet."
        message="Start with what applies to your role: the requirements, the deadline and one thing to do this sprint."
        action={{ label: 'Get started', href: '#role' }}
      />
    );
  } else if (total === 0) {
    body = (
      <EmptyState
        title="No resources match."
        message={
          q
            ? `Nothing matches "${q}"${role === 'all' ? '' : ' for ' + current.label}. Clear the filters, or get started with your role's requirements.`
            : `Nothing for ${current.label} yet. Clear the filters, or get started with your role's requirements.`
        }
        action={{ label: 'Get started', href: '#role' }}
        secondary={{ label: 'Clear filters', onClick: clearFilters }}
      />
    );
  } else {
    body = (
      <>
        <div className="res-groups">
          {pageGroups.map((grp) => (
            <section key={grp.g} className="res-group">
              <h3>
                {grp.g} <span className="count">{groupTotals[grp.g]}</span>
              </h3>
              <ul>
                {grp.hits.map((it) => (
                  <li key={it[1]}>
                    <a href={it[1]}>{it[0]}</a>
                    <span className="d">{it[2]}</span>
                    <span className="roles">
                      <span className="vh">For: </span>
                      {it[3].map((r) => (
                        <span key={r} className={r === role ? 'on' : ''}>
                          {SHORT[r]}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <Pagination
          label="Resource pages"
          page={p.page}
          pages={p.pages}
          numbers={pageNumbers(p.page, p.pages)}
          from={p.from}
          to={p.to}
          total={p.total}
          onChange={setPage}
          focusOnChange="#h-resources"
        />
      </>
    );
  }

  return (
    <section className="view" id="v-resources" aria-labelledby="h-resources">
      <div className="view-head">
        <h2 id="h-resources">Resource library</h2>
        <p className="lede">
          Primary sources first, then practitioner guides. Pick your role to see what's most useful
          for your work, then narrow by keyword.
        </p>
      </div>

      <div className="lib-controls">
        <fieldset className="fieldset">
          <legend>Show resources for</legend>
          <div className="toggles">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                className="toggle"
                aria-pressed={r.id === role}
                onClick={() => pick(r.id)}
              >
                {r.label}
                {ready && <span className="ct"> ({resourceCount(all, r.id)})</span>}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="search">
          <label htmlFor="resFilter">Filter by keyword</label>
          <input
            id="resFilter"
            type="search"
            placeholder="e.g. EN 301 549, forms, Compose, VPAT"
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <p className="role-intro" aria-live="polite">
          {current.lead ? (
            <>
              <b>{current.lead}</b> {current.intro}
            </>
          ) : (
            current.intro
          )}
        </p>
        {ready && (
          <p className="xs muted" aria-live="polite">
            {total} {total === 1 ? 'resource' : 'resources'}
            {role === 'all' ? '' : ' for ' + current.label}
            {q ? ` matching "${q}"` : ''}
          </p>
        )}
      </div>

      {body}
    </section>
  );
}
