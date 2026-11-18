import { useState } from 'react';
import { store, readJSON, writeJSON } from '../lib/storage.js';

// A string kept in localStorage, e.g. the library role or the last platform tab.
// `isValid` rejects stale values so a removed option never gets selected.
export function useStoredString(key, isValid, fallback) {
  const [value, setValue] = useState(() => {
    const saved = store.get(key);
    return saved !== null && isValid(saved) ? saved : fallback;
  });
  function save(next) {
    setValue(next);
    store.set(key, next);
  }
  return [value, save];
}

// A JSON value kept in localStorage, e.g. checklist ticks.
export function useStoredJSON(key, fallback) {
  const [value, setValue] = useState(() => readJSON(key, fallback) || fallback);
  function save(next) {
    setValue(next);
    writeJSON(key, next);
  }
  return [value, save];
}
