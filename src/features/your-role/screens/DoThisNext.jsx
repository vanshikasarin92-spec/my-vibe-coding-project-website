import ActionSteps from '../components/ActionSteps.jsx';

// PRD screen: "Do this next" (R6). Shown once Do this now is done.
export default function DoThisNext({ t, r, ...actions }) {
  return (
    <ActionSteps
      eyebrow={t.doNext}
      title={r.nx.title}
      action={r.nx}
      backLabel={r.name}
      copyText=""
      {...actions}
    />
  );
}
