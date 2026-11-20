import { useEffect, useRef, useState } from 'react';
import { RA_T, RA_R, RA_COPY, RA_IDS, RA_LIB, RA_PLURAL } from './data/roles.js';
import { ErrorState } from '../../shared/components/StateViews.jsx';
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
import DoneChecklist from './components/DoneChecklist.jsx';
import { TICKET_T, RA_DOD, RA_COPY_KIND } from './data/tickets.js';
import { hubLink, roleFromSearch, detailLines, ticketText, checklistText } from './logic/ticket.js';
import ActionCard from './components/ActionCard.jsx';
import LanguageSwitch from './components/LanguageSwitch.jsx';
import { daysUntil, daysSince, formatDate, formatDayMonth } from '../../shared/logic/dates.js';
import { copyText } from '../../shared/lib/clipboard.js';

// Your role (PRD: the hub's default route, #role). This file only chooses which
// screen to show and wires it up: content comes from ./data, rules from ./logic,
// saved state from ./hooks, and each PRD screen is a component in ./screens.
export default function YourRole() {
  const {
    profile,
    syncError,
    retrySync,
    restored,
    pickRole,
    changeLanguage,
    markDone,
    openLibraryForRole,
  } = useProfile(RA_IDS, RA_LIB);
  const [lang, setLang] = useState(() => (profile && profile.lang === 'fr' ? 'fr' : 'en'));
  const [screen, setScreen] = useState(() => firstScreen(profile));
  const [from, setFrom] = useState('role');
  const [kind, setKind] = useState('do');
  const [open, setOpen] = useState({});
  const [status, setStatus] = useState('');
  const [dodStatus, setDodStatus] = useState('');
  const news = useWhatsNew(profile && profile.role, profile && profile.prevVisit);
  const root = useRef(null);
  const preRef = useRef(null);
  const ticketRef = useRef(null);
  const dodRef = useRef(null);
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

  // Opened from a ticket or checklist link (?role=dev&src=ticket#role): someone
  // without a saved role lands on that role. A saved role is kept. The query is
  // then removed so a reload or bookmark doesn't repeat it.
  useEffect(() => {
    const linked = roleFromSearch(window.location.search, RA_IDS);
    if (window.location.search) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.hash);
      } catch (e) {
        /* history unavailable */
      }
    }
    if (linked && !(profile && profile.role)) {
      pickRole(linked, lang);
      go('role');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const L = TICKET_T[lang];
  const base = window.location.origin + window.location.pathname;

  // The action on screen as a ticket for the team's tracker.
  function ticketFor(k) {
    const isDo = k === 'do';
    const a = isDo ? r.act : r.nx;
    const detailText = isDo && RA_COPY[id] ? RA_COPY[id][lang] || RA_COPY[id].en : '';
    return ticketText({
      L,
      title: isDo ? r.doTitle : r.nx.title,
      why: isDo ? r.doSub : r.nx.sub,
      byWhen: `${t.y27}: ${r.d27}`,
      steps: a.steps,
      details: detailLines(detailText, RA_COPY_KIND[id], id === 'dev' ? 'ts' : ''),
      link: hubLink(base, id, 'ticket'),
    });
  }

  function go(next, focusSel = '#h-role') {
    setScreen(next);
    setStatus('');
    setDodStatus('');
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
        checklist={
          RA_DOD[id] && (
            <DoneChecklist
              dod={RA_DOD[id][lang]}
              L={L}
              status={dodStatus}
              preRef={dodRef}
              onCopy={() =>
                copyText(
                  checklistText({ L, dod: RA_DOD[id][lang], link: hubLink(base, id, 'checklist') }),
                  dodRef.current,
                ).then((ok) => setDodStatus(ok ? L.dodCopied : t.copyFail))
              }
            />
          )
        }
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
      ticket: {
        L,
        text: ticketFor(kind),
        preRef: ticketRef,
        onCopy: () =>
          copyText(ticketFor(kind), ticketRef.current).then((ok) =>
            setStatus(ok ? L.copiedTicket : t.copyFail),
          ),
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
          <ErrorState
            message={t.syncFail}
            onRetry={retrySync}
            retryLabel={t.retry}
            focusAfterRetry="#h-role"
          />
        )}
      </div>
      <div className="vh" role="status" aria-live="polite">
        {onWelcomeBack && news.status === 'error' ? t.loadFail : ''}
      </div>
    </section>
  );
}
