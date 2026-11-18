// Loading, error and empty states shared by every data-backed screen.
import { useEffect, useRef } from 'react';

// Grey placeholder rows in the shape of the content. Screen readers hear one
// polite "Loading …" line instead of the shapes.
export function Skeleton({ label, rows = 4, lines = 2 }) {
  return (
    <div className="skel" aria-busy="true">
      <p className="vh" role="status">
        {label}
      </p>
      <ul className="skel-rows" aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i}>
            {Array.from({ length: lines }, (_, j) => (
              <span key={j} className={j === 0 ? 'skel-line skel-title' : 'skel-line'}></span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Inline error with a Retry button. Announced once; after Retry, focus moves to
// `focusAfterRetry` (usually the section heading) so it isn't lost when the
// button disappears.
export function ErrorState({ message, onRetry, focusAfterRetry, retryLabel = 'Retry' }) {
  return (
    <div className="state-error" role="alert">
      <span>{message}</span>
      <button
        type="button"
        className="btn"
        onClick={() => {
          onRetry();
          const el = focusAfterRetry && document.querySelector(focusAfterRetry);
          if (el) {
            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
            el.focus();
          }
        }}
      >
        {retryLabel}
      </button>
    </div>
  );
}

// An empty state that says why it's empty and offers a next step.
// `action` is { label, href } or { label, onClick }; `secondary` is optional.
export function EmptyState({ title, message, action, secondary }) {
  const renderAction = (a, primary) =>
    a.href ? (
      <a className={primary ? 'btn primary' : 'btn'} href={a.href} onClick={a.onClick}>
        {a.label}
      </a>
    ) : (
      <button type="button" className={primary ? 'btn primary' : 'btn'} onClick={a.onClick}>
        {a.label}
      </button>
    );
  return (
    <div className="state-empty">
      <p className="state-empty-title">{title}</p>
      {message && <p>{message}</p>}
      <div className="btn-group">
        {action && renderAction(action, true)}
        {secondary && renderAction(secondary, false)}
      </div>
    </div>
  );
}

// Previous / page numbers / Next. Changing page moves focus to `focusOnChange`
// so keyboard and screen reader users start reading the new page from the top.
export function Pagination({
  label,
  page,
  pages,
  numbers,
  from,
  to,
  total,
  onChange,
  focusOnChange,
}) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = focusOnChange && document.querySelector(focusOnChange);
    if (el) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus();
    }
    // Only when the page changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (total === 0) return null;
  return (
    <nav className="pager" aria-label={label}>
      <p className="pager-range" aria-live="polite">
        Showing {from}–{to} of {total}
      </p>
      {pages > 1 && (
        <ul>
          <li>
            <button
              type="button"
              className="btn"
              disabled={page === 1}
              onClick={() => onChange(page - 1)}
            >
              Previous
            </button>
          </li>
          {numbers.map((n, i) =>
            n === null ? (
              <li key={'gap' + i} aria-hidden="true" className="pager-gap">
                …
              </li>
            ) : (
              <li key={n}>
                <button
                  type="button"
                  className="pager-num"
                  aria-current={n === page ? 'page' : undefined}
                  aria-label={'Page ' + n}
                  onClick={() => onChange(n)}
                >
                  {n}
                </button>
              </li>
            ),
          )}
          <li>
            <button
              type="button"
              className="btn"
              disabled={page === pages}
              onClick={() => onChange(page + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}
