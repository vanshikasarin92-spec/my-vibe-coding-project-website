import { useEffect, useRef, useState } from 'react';
import { RA_T, RA_R, RA_COPY, RA_IDS, RA_LIB, RA_PLURAL } from './data/roles.js';
import { ACA_DEADLINES } from './data/deadlines.js';
import { actionsFor, firstScreen } from './logic/profile.js';
import { useProfile } from './hooks/useProfile.js';
import { useWhatsNew } from './hooks/useWhatsNew.js';
import RolePicker from './screens/RolePicker.jsx';
import RoleView from './screens/RoleView.jsx';
import DoThisNow from './screens/DoThisNow.jsx';
import DoThisNext from './screens/DoThisNext.jsx';
import ActionDone from './screens/ActionDone.jsx';
import WelcomeBack from './screens/WelcomeBack.jsx';
import ActionCard from './components/ActionCard.jsx';
import LanguageSwitch from './components/LanguageSwitch.jsx';
import { daysUntil, daysSince, formatDate, formatDayMonth } from '../../shared/logic/dates.js';
import { copyText } from '../../shared/lib/clipboard.js';

// Your role (PRD: the hub's default route, #role). This file only chooses which
// screen to show and wires it up: content comes from ./data, rules from ./logic,
// saved state from ./hooks, and each PRD screen is a component in ./screens.
export default function YourRole() {
  const { profile, syncError, restored, pickRole, changeLanguage, markDone, openLibraryForRole } =
    useProfile(RA_IDS, RA_LIB);
  const [lang, setLang] = useState(() => (profile && profile.lang === 'fr' ? 'fr' : 'en'));
  const [screen, setScreen] = useState(() => firstScreen(profile));
  const [from, setFrom] = useState('role');
  const [kind, setKind] = useState('do');
  const [open, setOpen] = useState({});
  const [status, setStatus] = useState('');
  const news = useWhatsNew(profile && profile.role, profile && profile.prevVisit);
  const root = useRef(null);
  const preRef = useRef(null);
  const focusNext = useRef(null);

  // Move focus after a screen change: to the new heading, or back to the control that was used.
  useEffect(() => {
    if (!focusNext.current || !root.current) return;
    const el = root.current.querySelector(focusNext.current);
    focusNext.current = null;
    if (el) el.focus();
  });

  // When signing in fills in a profile this browser didn't have, leave the Role picker.
  useEffect(() => {
    if (restored && screen === 'picker') {
      if (profile && profile.lang) setLang(profile.lang);
      go('role');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restored]);

  // Another tab or device changed the language (last-write-wins): follow it.
  const savedLang = profile && profile.lang;
  useEffect(() => {
    if (savedLang && savedLang !== lang) setLang(savedLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedLang]);

  const t = RA_T[lang];
  const id = profile && profile.role;
  const r = id ? RA_R[id][lang] : null;
  const acts = actionsFor(profile);
  const days = { y2027: daysUntil(ACA_DEADLINES.y2027), y2028: daysUntil(ACA_DEADLINES.y2028) };
  const fmt = (ts) => formatDate(ts, t.months);

  function go(next, focusSel = '#h-role') {
    setScreen(next);
    setStatus('');
    focusNext.current = focusSel;
  }
  function switchLang() {
    const next = lang === 'en' ? 'fr' : 'en';
    setLang(next);
    changeLanguage(next);
    focusNext.current = '[data-act="lang"]';
  }
  function start(k) {
    setFrom(screen === 'return' ? 'return' : 'role');
    setKind(k);
    go('action');
  }

  const languageSwitch = <LanguageSwitch t={t} onSwitch={switchLang} />;
  const actionCard = (onReturn) => (
    <ActionCard t={t} r={r} acts={acts} onReturn={onReturn} onStart={start} fmt={fmt} />
  );

  let body;
  if (screen === 'picker' || !id) {
    body = (
      <RolePicker
        t={t}
        roles={RA_IDS.map((rid) => ({ id: rid, ...RA_R[rid][lang] }))}
        daysLeft={days.y2027}
        onPick={(rid) => {
          pickRole(rid, lang);
          setOpen({});
          go('role');
        }}
        languageSwitch={languageSwitch}
      />
    );
  } else if (screen === 'role') {
    body = (
      <RoleView
        t={t}
        r={r}
        roleId={id}
        days={days}
        open={open}
        onToggle={(key, i) => {
          setOpen({ ...open, [key]: !open[key] });
          focusNext.current = `[data-crit="${i}"]`;
        }}
        onChangeRole={() => go('picker')}
        onLibrary={openLibraryForRole}
        actionCard={actionCard(false)}
        languageSwitch={languageSwitch}
      />
    );
  } else if (screen === 'action') {
    const shared = {
      t,
      r,
      status,
      preRef,
      onBack: () => go(from),
      onCopy: (text) =>
        copyText(text, preRef.current).then((ok) => setStatus(ok ? t.copied : t.copyFail)),
      onFinish: () => {
        markDone(kind);
        go('done');
      },
      languageSwitch,
    };
    body =
      kind === 'do' ? (
        <DoThisNow
          {...shared}
          roleId={id}
          copyText={RA_COPY[id] ? RA_COPY[id][lang] || RA_COPY[id].en : ''}
        />
      ) : (
        <DoThisNext {...shared} />
      );
  } else if (screen === 'done') {
    body = (
      <ActionDone t={t} r={r} kind={kind} onBack={() => go(from)} languageSwitch={languageSwitch} />
    );
  } else {
    body = (
      <WelcomeBack
        t={t}
        r={r}
        acts={acts}
        prevVisit={profile.prevVisit}
        news={news}
        emptyMessage={t.nothingNew(
          RA_PLURAL[lang][id],
          formatDayMonth(profile.prevVisit, t.months),
        )}
        daysLeft={days.y2027}
        fewerDays={daysSince(profile.prevVisit)}
        fmt={fmt}
        onChangeRole={() => go('picker')}
        onRetry={() => {
          news.retry();
          focusNext.current = '#ra-ch';
        }}
        onRequirements={() => {
          setFrom('role');
          go('role');
        }}
        actionCard={actionCard(true)}
        languageSwitch={languageSwitch}
      />
    );
  }

  const onWelcomeBack = screen === 'return' && id;
  return (
    <section className="view" id="v-role" aria-labelledby="h-role">
      <div className="ra" lang={lang} ref={root}>
        {body}
        {syncError && (
          <p className="acc-sync" role="status">
            {t.syncFail}
          </p>
        )}
      </div>
      <div className="vh" role="status" aria-live="polite">
        {onWelcomeBack && news.status === 'error' ? t.loadFail : ''}
      </div>
    </section>
  );
}
