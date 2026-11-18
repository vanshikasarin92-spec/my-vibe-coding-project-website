// Unit tests for moving progress between this browser and an account (last-write-wins).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  actionsToRows,
  rowsToActions,
  mergeActions,
  mergeProfile,
  mergeTicks,
  changedTicks,
} from './syncProgress.js';

const T1 = Date.parse('2026-11-01T10:00:00Z');
const T2 = Date.parse('2026-11-10T10:00:00Z');
const iso = (t) => new Date(t).toISOString();
const IDS = ['dev', 'po'];

test('actions round-trip between browser and account shapes', () => {
  const actions = { dev: { do: T1, next: T2 } };
  const rows = actionsToRows(actions);
  assert.equal(rows.length, 2);
  assert.deepEqual(rowsToActions(rows), actions);
});

test('merging actions keeps every action and the earliest time', () => {
  const merged = mergeActions({ dev: { do: T2 } }, { dev: { do: T1 }, po: { do: T2 } });
  assert.deepEqual(merged, { dev: { do: T1 }, po: { do: T2 } });
});

test('a new browser restores the account profile', () => {
  const account = {
    profile: { role_id: 'po', lang: 'fr', client_updated_at: iso(T1) },
    completions: [{ role_id: 'po', kind: 'do', completed_at: iso(T1) }],
  };
  const p = mergeProfile(null, account, IDS, T2);
  assert.equal(p.role, 'po');
  assert.equal(p.lang, 'fr');
  assert.equal(p.updatedAt, T1);
  assert.equal(p.actions.po.do, T1);
  assert.equal(p.prevVisit, null);
});

test('last write wins: a newer local role beats an older account role', () => {
  const local = { role: 'dev', lang: 'en', updatedAt: T2, actions: { dev: { do: T2 } } };
  const account = {
    profile: { role_id: 'po', lang: 'fr', client_updated_at: iso(T1) },
    completions: [{ role_id: 'po', kind: 'do', completed_at: iso(T1) }],
  };
  const p = mergeProfile(local, account, IDS);
  assert.equal(p.role, 'dev');
  assert.equal(p.lang, 'en');
  assert.deepEqual(p.actions, { dev: { do: T2 }, po: { do: T1 } });
});

test('last write wins: a newer account role beats an older local role', () => {
  const local = { role: 'dev', lang: 'en', updatedAt: T1, actions: {} };
  const account = {
    profile: { role_id: 'po', lang: 'fr', client_updated_at: iso(T2) },
    completions: [],
  };
  const p = mergeProfile(local, account, IDS);
  assert.equal(p.role, 'po');
  assert.equal(p.lang, 'fr');
  assert.equal(p.updatedAt, T2);
});

test('an account with no usable role gives nothing to restore', () => {
  assert.equal(mergeProfile(null, { profile: { role_id: null }, completions: [] }, IDS), null);
  assert.equal(mergeProfile(null, { profile: { role_id: 'gone' }, completions: [] }, IDS), null);
});

test('ticks: per item, the later edit wins; a tie keeps this browser', () => {
  const { ticks, at } = mergeTicks({ d1: true, d2: false, d4: true }, { d1: T2, d2: T1, d4: T1 }, [
    { item_id: 'd1', ticked: false, client_updated_at: iso(T1) }, // older: local wins
    { item_id: 'd2', ticked: true, client_updated_at: iso(T2) }, // newer: account wins
    { item_id: 'd3', ticked: true, client_updated_at: iso(T1) }, // only on the account
    { item_id: 'd4', ticked: false, client_updated_at: iso(T1) }, // tie: local wins
  ]);
  assert.deepEqual(ticks, { d1: true, d2: true, d3: true, d4: true });
  assert.equal(at.d2, T2);
});

test('only changed ticks are sent', () => {
  assert.deepEqual(changedTicks({ d1: true, d2: false }, { d1: true, d2: true }), { d2: false });
});
