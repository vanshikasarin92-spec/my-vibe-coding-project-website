// Release checklists. Items in ./data, progress rules in ./logic, ticks saved by ./hooks.

import { CHECKLISTS } from './data/checklists.js';
import { useChecklistTicks } from './hooks/useChecklistTicks.js';
import { useAuth } from '../../shared/hooks/useAuth.jsx';
import { doneCount, clearTicks } from './logic/progress.js';
import { EmptyState, ErrorState } from '../../shared/components/StateViews.jsx';

export default function Checklists() {
  // Ticks are saved in this browser, and to the person's own account when signed in.
  const [checked, update, syncError, retrySync] = useChecklistTicks();
  const signedIn = useAuth().status === 'signed-in';
  const nothingTicked = CHECKLISTS.every((col) => doneCount(col.items, checked) === 0);

  // Get started: move focus to the first item of the first checklist.
  function startFirst() {
    const first = document.querySelector('#checks input[type=checkbox]');
    if (first) first.focus();
  }

  return (
    <section className="view" id="v-checklists" aria-labelledby="h-checklists">
      <div className="view-head">
        <h2 id="h-checklists">Checklists</h2>
        <p className="lede">
          One pass per feature.{' '}
          {signedIn ? 'Ticks are saved to your account.' : 'Ticks are saved only in your browser.'}
        </p>
        {syncError && (
          <ErrorState
            message="Couldn't save to your account. Your ticks are kept in this browser; Retry sends them now."
            onRetry={retrySync}
            focusAfterRetry="#h-checklists"
          />
        )}
        <p className="small">
          References in grey are <strong>WCAG 2.2</strong> success criteria, our build target.
          References in red are <strong>CAN/ASC-EN 301 549</strong> clauses that go beyond WCAG; the
          ACA regulations require these too.
        </p>
      </div>
      {nothingTicked && (
        <EmptyState
          title="You haven't ticked anything yet."
          message="Pick the checklist for the work you're doing and go through it once per feature."
          action={{ label: 'Get started', onClick: startFirst }}
        />
      )}
      <div className="checks" id="checks">
        {CHECKLISTS.map((col) => {
          const done = doneCount(col.items, checked);
          return (
            <section key={col.id} className="checkcol" aria-labelledby={col.id}>
              <header>
                <h3 id={col.id}>{col.title}</h3>
                <span className="count" aria-live="polite">
                  {done} of {col.items.length} done
                </span>
              </header>
              <div className="meter" aria-hidden="true">
                <i
                  style={{ width: (col.items.length ? (done / col.items.length) * 100 : 0) + '%' }}
                ></i>
              </div>
              <ul>
                {col.items.map((it) => (
                  <li key={it.id}>
                    <label>
                      <input
                        type="checkbox"
                        id={it.id}
                        checked={!!checked[it.id]}
                        onChange={(e) => update({ ...checked, [it.id]: e.target.checked })}
                      />
                      <span>
                        {it.text}
                        {it.refs.map((r, i) => (
                          <span key={i}>
                            {' '}
                            <span className={r.en ? 'ref en' : 'ref'}>{r.text}</span>
                          </span>
                        ))}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <button
                className="btn"
                type="button"
                onClick={() => update(clearTicks(col.items, checked))}
              >
                Clear list
              </button>
            </section>
          );
        })}
      </div>
    </section>
  );
}
