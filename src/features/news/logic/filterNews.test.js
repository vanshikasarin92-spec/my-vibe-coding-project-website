// Unit tests for the news filter.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newsByTopic } from './filterNews.js';

test('news filter keeps one topic, or everything for all', () => {
  const items = [{ topic: 'a' }, { topic: 'b' }];
  assert.equal(newsByTopic(items, 'a').length, 1);
  assert.equal(newsByTopic(items, 'all').length, 2);
});
