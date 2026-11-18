// Unit tests for shared logic. Run all tests with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DAY, daysUntil, daysSince, formatDate } from './dates.js';
import { viewFromHash, pageTitle, tabIndexForKey } from './navigation.js';

const NOW = Date.parse('2026-11-12T12:00:00Z');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

test('daysUntil counts whole days and never goes negative', () => {
  assert.equal(daysUntil('2026-11-14', NOW), 2);
  assert.equal(daysUntil('2020-01-01', NOW), 0);
});

test('daysSince and formatDate', () => {
  assert.equal(daysSince(NOW - 14 * DAY, NOW), 14);
  assert.equal(formatDate(Date.parse('2026-10-28T12:00:00Z'), MONTHS), '28 Oct 2026');
});

test('routing and tab keys', () => {
  assert.equal(viewFromHash('#news', ['role', 'news'], 'role'), 'news');
  assert.equal(viewFromHash('#nope', ['role', 'news'], 'role'), 'role');
  assert.equal(
    pageTitle([{ id: 'news', label: 'Latest news' }], 'news', 'role', 'Hub'),
    'Latest news · Hub',
  );
  assert.equal(tabIndexForKey('ArrowLeft', 0, 3), 2);
  assert.equal(tabIndexForKey('Enter', 0, 3), null);
});
