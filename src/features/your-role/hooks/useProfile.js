// The Your role profile: React state, rules from ../logic/profile.js, saved in this
// browser, and, when someone is signed in, also saved to their own account rows.
// Simultaneous edits (two tabs or devices) resolve by last-write-wins.

import { useEffect, useRef, useState } from 'react';
import { readJSON, writeJSON, session, store, KEYS } from '../../../shared/lib/storage.js';
import { useAuth } from '../../../shared/hooks/useAuth.jsx';
import { useOnReturn } from '../../../shared/hooks/useOnReturn.js';
import { loadUserData, saveProfile, saveCompletions } from '../../../shared/lib/userData.js';
import { mergeProfile, actionsToRows } from '../../../shared/logic/syncProgress.js';
import {
  validProfile,
  startVisit,
  chooseRole,
  setLanguage,
  markActionDone,
} from '../logic/profile.js';

// Loads the profile once per page load, counting a new browser session as a new visit.
function loadProfile(roleIds) {
  const isNewSession = !session.get(KEYS.visit);
  session.set(KEYS.visit, '1');
  const saved = validProfile(readJSON(KEYS.profile, null), roleIds);
  const profile = startVisit(saved, isNewSession);
  if (profile !== saved) writeJSON(KEYS.profile, profile);
  return profile;
}

// libraryRoleFor maps a role to its Resource library filter, which is saved alongside.
export function useProfile(roleIds, libraryRoleFor) {
  const [profile, setProfile] = useState(() => loadProfile(roleIds));
  const [syncError, setSyncError] = useState(false);
  const [restored, setRestored] = useState(0); // bumps when the account filled in a profile
  const { user } = useAuth();
  const userId = user ? user.id : null;
  const current = useRef(profile);
  current.current = profile;

  function saveLocal(next) {
    current.current = next;
    setProfile(next);
    writeJSON(KEYS.profile, next);
  }

  // Send this profile to the signed-in person's account; keep going locally if it fails.
  async function push(next, rows) {
    if (!userId || !next) return;
    const results = await Promise.all([
      saveProfile(userId, {
        role_id: next.role,
        lang: next.lang,
        library_role_id: libraryRoleFor[next.role],
        ...(next.updatedAt ? { client_updated_at: new Date(next.updatedAt).toISOString() } : {}),
      }),
      saveCompletions(userId, rows),
    ]);
    setSyncError(results.some((r) => r.error));
  }

  // Pull the account and merge it with this browser (last-write-wins), then save both ways.
  async function pull() {
    if (!userId) return;
    const { data, error } = await loadUserData(userId);
    if (error) {
      setSyncError(true);
      return;
    }
    const local = current.current;
    const merged = mergeProfile(local, data, roleIds);
    if (!merged) return;
    const changed = JSON.stringify(merged) !== JSON.stringify(local);
    if (changed) saveLocal(merged);
    if (!local || (local.role !== merged.role && merged.role)) {
      store.set(KEYS.libraryRole, libraryRoleFor[merged.role]);
    }
    if (!local) setRestored((n) => n + 1);
    push(merged, actionsToRows(merged.actions));
  }

  // On sign-in, and whenever the person comes back to this tab.
  useEffect(() => {
    pull();
    // pull reads the latest profile through a ref; runs once per sign-in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  useOnReturn(pull, !!userId);

  return {
    profile,
    syncError,
    retrySync: pull, // pulls, merges and sends again
    restored,
    signedIn: !!userId,
    pickRole(roleId, lang) {
      const next = chooseRole(profile, roleId, lang);
      saveLocal(next);
      store.set(KEYS.libraryRole, libraryRoleFor[roleId]);
      push(next, []);
    },
    changeLanguage(lang) {
      if (!profile) return;
      const next = setLanguage(profile, lang);
      saveLocal(next);
      push(next, []);
    },
    markDone(kind) {
      const next = markActionDone(profile, kind);
      saveLocal(next);
      push(next, actionsToRows({ [next.role]: { [kind]: next.actions[next.role][kind] } }));
    },
    openLibraryForRole() {
      if (profile) store.set(KEYS.libraryRole, libraryRoleFor[profile.role]);
    },
  };
}
