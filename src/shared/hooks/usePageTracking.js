// Counts a page view each time the page (the URL hash) changes, and reports how
// long it was on screen when the person moves on, hides the tab or leaves.
// Silent and best effort: it never shows anything and never blocks the page.
import { useEffect, useRef } from 'react';
import { nextIds, shouldCount, visibleMs } from '../logic/visits.js';
import {
  analyticsConfigured,
  newId,
  readVisitIds,
  writeVisitIds,
  recordView,
  endView,
} from '../lib/analytics.js';

function counting() {
  return shouldCount({
    configured: analyticsConfigured,
    hostname: window.location.hostname,
    webdriver: navigator.webdriver,
    globalPrivacyControl: navigator.globalPrivacyControl,
    doNotTrack: navigator.doNotTrack || window.doNotTrack,
  });
}

export function usePageTracking(page) {
  const current = useRef(null); // { id, visitorId, acc, visibleSince }

  // Report the time so far for the view on screen (it can be sent again later;
  // the database keeps the largest value).
  const report = () => {
    const v = current.current;
    if (!v) return;
    const send = () => endView({ id: v.id, visitorId: v.visitorId, ms });
    const ms = visibleMs(v.acc, v.visibleSince, Date.now());
    // The time can only be stored once the view itself is saved.
    if (v.saved) send();
    else v.saving.then(send);
  };

  useEffect(() => {
    if (!counting()) return undefined;
    const now = Date.now();
    const ids = nextIds(readVisitIds(), now, newId);
    writeVisitIds(ids);
    const view = {
      id: newId(),
      visitorId: ids.visitorId,
      acc: 0,
      visibleSince: document.visibilityState === 'hidden' ? null : now,
    };
    view.saving = recordView({
      id: view.id,
      visitorId: ids.visitorId,
      sessionId: ids.sessionId,
      page,
    }).then(() => {
      view.saved = true;
    });
    current.current = view;
    return () => {
      report();
      current.current = null;
    };
    // report reads the ref only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!counting()) return undefined;
    const onVisibility = () => {
      const v = current.current;
      if (!v) return;
      const now = Date.now();
      if (document.visibilityState === 'hidden') {
        v.acc = visibleMs(v.acc, v.visibleSince, now);
        v.visibleSince = null;
        report();
      } else if (v.visibleSince === null) {
        v.visibleSince = now;
        writeVisitIds({ ...(readVisitIds() || {}), lastSeen: now });
      }
    };
    const onLeave = () => report();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onLeave);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
