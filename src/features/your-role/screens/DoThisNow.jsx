import ActionSteps from '../components/ActionSteps.jsx';

// PRD screen: "Do this now" (R5). One action for the role, with text to copy.
export default function DoThisNow({ t, r, roleId, copyText, ...actions }) {
  return (
    <ActionSteps
      eyebrow={t.doNow}
      title={r.doTitle}
      action={r.act}
      backLabel={r.name}
      copyText={copyText}
      copyLang={roleId === 'dev' ? 'en' : undefined}
      {...actions}
    />
  );
}
