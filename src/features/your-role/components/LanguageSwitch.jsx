// PRD R10: switches the role page between English and French. Labelled in the other language.
export default function LanguageSwitch({ t, onSwitch }) {
  return (
    <button type="button" className="ra-alt" data-act="lang" lang={t.otherLang} onClick={onSwitch}>
      {t.otherLangLabel}
    </button>
  );
}
