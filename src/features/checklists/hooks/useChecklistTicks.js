// Checklist ticks, saved in this browser and, when someone is signed in, to their
// own checklist_ticks rows. Each tick records when it changed; simultaneous edits
// (two tabs or devices) resolve by last-write-wins, item by item.
import { useEffect, useRef, useState } from 'react';
import { useStoredJSON } from '../../../shared/hooks/useStored.js';
import { useOnReturn } from '../../../shared/hooks/useOnReturn.js';
import { KEYS } from '../../../shared/lib/storage.js';
import { useAuth } from '../../../shared/hooks/useAuth.jsx';
import { loadUserData, saveTicks } from '../../../shared/lib/userData.js';
import { mergeTicks, changedTicks } from '../../../shared/logic/syncProgress.js';

export function useChecklistTicks() {
  const [ticks, setTicks] = useStoredJSON(KEYS.checks, {});
  const [at, setAt] = useStoredJSON(KEYS.checksAt, {});
  const [syncError, setSyncError] = useState(false);
  const { user } = useAuth();
  const userId = user ? user.id : null;
  const latest = useRef({ ticks, at });
  latest.current = { ticks, at };
  const accountTicks = useRef({}); // what the account holds, to send only changes

  // Pull the account, merge item by item, and send back what this browser has newer.
  async function pull() {
    if (!userId) return;
    const { data, error } = await loadUserData(userId);
    if (error) {
      setSyncError(true);
      return;
    }
    const fromAccount = Object.fromEntries(data.ticks.map((r) => [r.item_id, r.ticked]));
    const merged = mergeTicks(latest.current.ticks, latest.current.at, data.ticks);
    setTicks(merged.ticks);
    setAt(merged.at);
    latest.current = merged;
    const res = await saveTicks(userId, changedTicks(merged.ticks, fromAccount), merged.at);
    if (!res.error) accountTicks.current = merged.ticks;
    setSyncError(!!res.error);
  }

  useEffect(() => {
    pull();
    // pull reads the latest ticks through a ref; runs once per sign-in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  useOnReturn(pull, !!userId);

  async function update(next) {
    const now = Date.now();
    const nextAt = { ...latest.current.at };
    Object.keys(changedTicks(next, latest.current.ticks)).forEach((id) => {
      nextAt[id] = now;
    });
    setTicks(next);
    setAt(nextAt);
    latest.current = { ticks: next, at: nextAt };
    if (!userId) return;
    const res = await saveTicks(userId, changedTicks(next, accountTicks.current), nextAt);
    if (!res.error) accountTicks.current = next;
    setSyncError(!!res.error);
  }

  return [ticks, update, syncError, pull];
}
