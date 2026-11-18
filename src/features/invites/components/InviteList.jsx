import { useState } from 'react';
import {
  Skeleton,
  ErrorState,
  EmptyState,
  Pagination,
} from '../../../shared/components/StateViews.jsx';
import { paginate, pageNumbers } from '../../../shared/logic/paginate.js';
import { statusLabel, formatDay } from '../logic/invites.js';

const PAGE_SIZE = 10;

// The invites this person sent, with status, date and Cancel for pending ones.
export default function InviteList({ copy, list, onCancel, onGetStarted }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const rows = list.data || [];
  const p = paginate(rows, page, PAGE_SIZE);

  async function cancel(inv) {
    const ok = await onCancel(inv.id);
    setStatus(ok ? copy.cancelled(inv.recipient_email) : copy.cancelFail);
    const heading = document.getElementById('inv-list-h');
    if (heading) heading.focus();
  }

  return (
    <section className="ra-sec" aria-labelledby="inv-list-h">
      <h3 id="inv-list-h" tabIndex={-1}>
        {copy.listHeading}
      </h3>
      <p className="ra-status" role="status">
        {status}
      </p>
      {list.status === 'loading' && <Skeleton label={copy.listLoading} rows={3} lines={1} />}
      {list.status === 'error' && (
        <ErrorState message={copy.listError} onRetry={list.retry} focusAfterRetry="#inv-list-h" />
      )}
      {list.status === 'ready' && rows.length === 0 && (
        <EmptyState
          title={copy.emptyTitle}
          message={copy.emptyMessage}
          action={{ label: copy.getStarted, onClick: onGetStarted }}
        />
      )}
      {list.status === 'ready' && rows.length > 0 && (
        <>
          <div className="tablewrap">
            <table className="inv-table">
              <thead>
                <tr>
                  <th scope="col">{copy.colRecipient}</th>
                  <th scope="col">{copy.colStatus}</th>
                  <th scope="col">{copy.colSent}</th>
                  <th scope="col">{copy.colAction}</th>
                </tr>
              </thead>
              <tbody>
                {p.items.map((inv) => (
                  <tr key={inv.id}>
                    <th scope="row">{inv.recipient_email}</th>
                    <td>
                      <span className={'inv-status inv-' + inv.status}>
                        {statusLabel(inv.status)}
                      </span>
                    </td>
                    <td className="num">{formatDay(inv.created_at)}</td>
                    <td>
                      {inv.status === 'pending' ? (
                        <button
                          type="button"
                          className="btn"
                          aria-label={copy.cancelFor(inv.recipient_email)}
                          onClick={() => cancel(inv)}
                        >
                          {copy.cancel}
                        </button>
                      ) : (
                        <span className="muted">–</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            label="Invite pages"
            page={p.page}
            pages={p.pages}
            numbers={pageNumbers(p.page, p.pages)}
            from={p.from}
            to={p.to}
            total={p.total}
            onChange={setPage}
            focusOnChange="#inv-list-h"
          />
        </>
      )}
    </section>
  );
}
