// Unit tests for the analytics figures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDuration,
  formatPercent,
  formatDay,
  changeText,
  kpiTiles,
  isEmpty,
  niceMax,
  chartModel,
  nearestIndex,
  separate,
  pageLabel,
} from './analytics.js';

test('durations read like a clock', () => {
  assert.equal(formatDuration(null), '–');
  assert.equal(formatDuration(400), '0s');
  assert.equal(formatDuration(45000), '45s');
  assert.equal(formatDuration(125000), '2m 05s');
  assert.equal(formatDuration(3720000), '1h 02m');
});

test('percent and day formats', () => {
  assert.equal(formatPercent(50), '50%');
  assert.equal(formatPercent('33.3'), '33.3%');
  assert.equal(formatPercent(null), '–');
  assert.equal(formatDay('2026-11-05'), 'Nov 5');
});

test('change against the previous period, in words', () => {
  assert.equal(changeText(12, 10, 'count', 7), 'Up 20% on the previous 7 days');
  assert.equal(changeText(5, 10, 'count', 7), 'Down 50% on the previous 7 days');
  assert.equal(changeText(3, 0, 'count', 7), 'New since the previous 7 days');
  assert.equal(changeText(40, 45.5, 'rate', 30), 'Down 5.5 points on the previous 30 days');
  assert.equal(changeText(10, 10, 'count', 7), 'Same as the previous 7 days');
  assert.equal(changeText(10, null, 'count', 7), 'No data for the previous 7 days');
});

const DATA = {
  days: 30,
  current: {
    visitors: 2,
    page_views: 3,
    visits: 2,
    views_per_visit: 1.5,
    avg_visit_ms: 47500,
    bounce_rate: 50,
  },
  previous: {
    visitors: 1,
    page_views: 1,
    visits: 1,
    views_per_visit: 1,
    avg_visit_ms: 0,
    bounce_rate: 100,
  },
  series: [],
  pages: [],
};

test('tiles come from the analytics row', () => {
  const t = Object.fromEntries(kpiTiles(DATA).map((x) => [x.id, x]));
  assert.equal(t.visitors.value, '2');
  assert.equal(t.views.value, '3');
  assert.equal(t['per-visit'].value, '1.50');
  assert.equal(t.duration.value, '48s'); // 47.5s rounds up
  assert.equal(t.bounce.value, '50%');
  assert.equal(t.bounce.note, 'Down 50 points on the previous 30 days');
  assert.equal(t.visitors.note, 'Up 100% on the previous 30 days');
});

test('no earlier traffic: the comparison says so instead of inventing one', () => {
  const t = kpiTiles({ ...DATA, previous: { visitors: 0, page_views: 0, visits: 0 } });
  assert.equal(t[0].note, 'No data for the previous 30 days');
});

test('empty when nothing was viewed', () => {
  assert.equal(isEmpty({ current: { page_views: 0 } }), true);
  assert.equal(isEmpty(DATA), false);
  assert.equal(isEmpty(null), true);
});

test('nice axis maximum', () => {
  assert.equal(niceMax(0), 4);
  assert.equal(niceMax(7), 10);
  assert.equal(niceMax(13), 20);
  assert.equal(niceMax(41), 50);
  assert.equal(niceMax(100), 100);
});

test('chart geometry spans the box', () => {
  const series = [
    { day: '2026-11-18', visitors: 0, page_views: 0 },
    { day: '2026-11-19', visitors: 2, page_views: 4 },
    { day: '2026-11-20', visitors: 1, page_views: 2 },
  ];
  const box = { width: 300, height: 140, pad: { top: 10, right: 50, bottom: 30, left: 30 } };
  const m = chartModel(series, ['page_views', 'visitors'], box);
  assert.equal(m.max, 4);
  assert.equal(m.lines.page_views[0].x, 30);
  assert.equal(m.lines.page_views[2].x, 250);
  assert.equal(m.lines.page_views[1].y, 10); // the maximum touches the top
  assert.equal(m.lines.visitors[0].y, 110); // zero sits on the baseline
  assert.equal(nearestIndex(140, 3, box), 1);
  assert.equal(nearestIndex(-50, 3, box), 0);
});

test('end labels never overlap', () => {
  assert.deepEqual(separate(50, 52, 14), [44, 58]);
  assert.deepEqual(separate(10, 80, 14), [10, 80]);
});

test('page names come from the menu', () => {
  assert.equal(pageLabel('news', [{ id: 'news', label: 'Latest news' }]), 'Latest news');
  assert.equal(pageLabel('gone', []), 'gone');
});
