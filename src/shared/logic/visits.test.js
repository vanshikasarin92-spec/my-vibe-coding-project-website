// Unit tests for visit counting rules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextIds, shouldCount, visibleMs, VISIT_GAP_MS } from './visits.js';

const ids = () => {
  let n = 0;
  return () => `id-${++n}`;
};

test('first view: new visitor and new visit', () => {
  assert.deepEqual(nextIds(null, 1000, ids()), {
    visitorId: 'id-1',
    sessionId: 'id-2',
    lastSeen: 1000,
  });
});

test('views within 30 minutes stay in the same visit', () => {
  const s = { visitorId: 'v', sessionId: 's', lastSeen: 0 };
  assert.deepEqual(nextIds(s, VISIT_GAP_MS, ids()), {
    visitorId: 'v',
    sessionId: 's',
    lastSeen: VISIT_GAP_MS,
  });
});

test('a gap over 30 minutes starts a new visit for the same visitor', () => {
  const s = { visitorId: 'v', sessionId: 's', lastSeen: 0 };
  const next = nextIds(s, VISIT_GAP_MS + 1, ids());
  assert.equal(next.visitorId, 'v');
  assert.equal(next.sessionId, 'id-1');
});

test('damaged storage starts fresh instead of failing', () => {
  assert.equal(nextIds('nonsense', 5, ids()).sessionId, 'id-2');
  assert.equal(
    nextIds({ visitorId: 'v', sessionId: 's', lastSeen: 'x' }, 5, ids()).sessionId,
    'id-1',
  );
});

test('who is counted', () => {
  const live = { configured: true, hostname: 'vanshikasarin92-spec.github.io' };
  assert.equal(shouldCount(live), true);
  assert.equal(shouldCount({ ...live, configured: false }), false);
  assert.equal(shouldCount({ ...live, hostname: 'localhost' }), false);
  assert.equal(shouldCount({ ...live, webdriver: true }), false);
  assert.equal(shouldCount({ ...live, globalPrivacyControl: true }), false);
  assert.equal(shouldCount({ ...live, doNotTrack: '1' }), false);
});

test('only on-screen time counts', () => {
  assert.equal(visibleMs(0, 1000, 4000), 3000);
  assert.equal(visibleMs(3000, null, 9000), 3000); // hidden since: no extra time
  assert.equal(visibleMs(3000, 10000, 12500), 5500);
});
