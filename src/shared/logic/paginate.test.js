// Unit tests for pagination.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginate, pageNumbers } from './paginate.js';

const ITEMS = Array.from({ length: 23 }, (_, i) => i + 1);

test('pages slice the list and report the range', () => {
  const p = paginate(ITEMS, 2, 10);
  assert.deepEqual(p.items, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  assert.equal(p.pages, 3);
  assert.equal(p.from, 11);
  assert.equal(p.to, 20);
  assert.equal(paginate(ITEMS, 3, 10).items.length, 3);
});

test('the page is clamped when the list shrinks or the number is out of range', () => {
  assert.equal(paginate(ITEMS, 9, 10).page, 3);
  assert.equal(paginate(ITEMS, 0, 10).page, 1);
  assert.equal(paginate([1, 2], 3, 10).page, 1);
});

test('an empty list is one empty page, with no division by zero', () => {
  assert.deepEqual(paginate([], 1, 10), { page: 1, pages: 1, total: 0, from: 0, to: 0, items: [] });
});

test('page numbers collapse with gaps when there are many pages', () => {
  assert.deepEqual(pageNumbers(1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(pageNumbers(6, 12), [1, null, 5, 6, 7, null, 12]);
  assert.deepEqual(pageNumbers(1, 12), [1, 2, null, 12]);
});
