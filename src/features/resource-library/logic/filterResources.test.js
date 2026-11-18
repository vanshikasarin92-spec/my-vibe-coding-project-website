// Unit tests for the Resource library filters and counts.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resourceCount, filterResources, hitCount } from './filterResources.js';

const GROUPS = [
  {
    g: 'Guides',
    items: [
      ['Forms', '#1', 'Labels', ['dev']],
      ['Colour', '#2', 'Contrast', ['des']],
    ],
  },
];
const LABELS = { dev: 'Developers', des: 'Designers' };

test('counts per role', () => {
  assert.equal(resourceCount(GROUPS, 'all'), 2);
  assert.equal(resourceCount(GROUPS, 'dev'), 1);
});

test('role and keyword filters combine; role labels are searchable', () => {
  assert.equal(hitCount(filterResources(GROUPS, 'all', 'designers', LABELS)), 1);
  assert.equal(filterResources(GROUPS, 'dev', 'colour', LABELS).length, 0);
});

test('pages keep their group headings', async () => {
  const { flattenHits, regroup } = await import('./filterResources.js');
  const groups = [
    { g: 'A', hits: [['a1'], ['a2']] },
    { g: 'B', hits: [['b1']] },
  ];
  const flat = flattenHits(groups);
  assert.equal(flat.length, 3);
  assert.deepEqual(regroup(flat.slice(1)), [
    { g: 'A', hits: [['a2']] },
    { g: 'B', hits: [['b1']] },
  ]);
});
