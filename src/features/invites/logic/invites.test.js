// Unit tests for invite rules and dashboard figures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRecipient, inviteErrorCode, metricTiles, statusLabel } from './invites.js';

test('recipient checks before sending', () => {
  assert.equal(validateRecipient('', 'me@x.ca'), 'missing');
  assert.equal(validateRecipient('nope', 'me@x.ca'), 'format');
  assert.equal(validateRecipient(' ME@x.ca ', 'me@x.ca'), 'self');
  assert.equal(validateRecipient('Pat@x.ca', 'me@x.ca', ['pat@x.ca']), 'duplicate');
  assert.equal(validateRecipient('pat@x.ca', 'me@x.ca', []), null);
});

test('database errors map to messages', () => {
  assert.equal(inviteErrorCode({ code: '23505', message: 'duplicate key' }), 'duplicate');
  assert.equal(inviteErrorCode({ message: 'You cannot invite yourself' }), 'self');
  assert.equal(inviteErrorCode({ message: 'Failed to fetch' }), 'network');
  assert.equal(inviteErrorCode(null), null);
});

test('tiles come from the metrics row', () => {
  const tiles = metricTiles({
    sent: 4,
    accepted: 1,
    pending: 2,
    cancelled: 1,
    acceptance_rate: '33.3',
    sent_last_7_days: 3,
    accepted_last_7_days: 1,
    my_sent: 2,
    my_accepted: 1,
  });
  const byId = Object.fromEntries(tiles.map((t) => [t.id, t]));
  assert.equal(byId.sent.value, '4');
  assert.equal(byId.sent.note, '2 by you');
  assert.equal(byId.rate.value, '33.3%');
  assert.equal(byId.pending.note, '1 cancelled');
  assert.equal(byId.week.value, '3');
});

test('no invites yet: rate shows a dash, counts show zero', () => {
  const tiles = metricTiles({ sent: 0, acceptance_rate: null });
  assert.equal(tiles.find((t) => t.id === 'rate').value, '–');
  assert.equal(tiles.find((t) => t.id === 'sent').value, '0');
  assert.equal(
    metricTiles({ acceptance_rate: '100.0' }).find((t) => t.id === 'rate').value,
    '100%',
  );
});

test('status labels', () => {
  assert.equal(statusLabel('accepted'), 'Accepted');
});
