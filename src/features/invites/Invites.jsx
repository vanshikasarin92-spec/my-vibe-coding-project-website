// Invites (#invites): invite colleagues, see your invites, and a dashboard whose
// figures are calculated live from the Supabase invites table.
// Text in ./data, rules in ./logic, state in ./hooks.
import { INVITES_COPY as copy } from './data/copy.js';
import { useInvites } from './hooks/useInvites.js';
import MetricTiles from './components/MetricTiles.jsx';
import InviteForm from './components/InviteForm.jsx';
import InviteList from './components/InviteList.jsx';
import { EmptyState } from '../../shared/components/StateViews.jsx';

export default function Invites() {
  const { auth, metrics, list, send, cancel, refresh, siteUrl } = useInvites();

  let body;
  if (auth.status === 'unavailable') {
    body = <p>{copy.unavailable}</p>;
  } else if (auth.status === 'loading') {
    body = null;
  } else if (auth.status !== 'signed-in') {
    body = (
      <EmptyState
        title={copy.signedOutTitle}
        message={copy.signedOutMessage}
        action={{ label: copy.getStarted, href: '#account' }}
      />
    );
  } else {
    body = (
      <>
        <MetricTiles copy={copy} metrics={metrics} onRefresh={refresh} />
        <InviteForm copy={copy} onSend={send} siteUrl={siteUrl} />
        <InviteList
          copy={copy}
          list={list}
          onCancel={cancel}
          onGetStarted={() => document.getElementById('inv-email')?.focus()}
        />
      </>
    );
  }

  return (
    <section className="view" id="v-invites" aria-labelledby="h-invites">
      <div className="view-head">
        <h2 id="h-invites">{copy.heading}</h2>
        <p className="lede">{copy.intro}</p>
      </div>
      {body}
    </section>
  );
}
