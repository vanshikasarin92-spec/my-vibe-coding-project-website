// Unit tests for checklist progress.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { doneCount, clearTicks } from './progress.js';

test('done count and clearing one list', () => {
  const items = [{ id: 'a' }, { id: 'b' }];
  assert.equal(doneCount(items, { a: true }), 1);
  assert.deepEqual(clearTicks(items, { a: true, z: true }), { a: false, b: false, z: true });
});
