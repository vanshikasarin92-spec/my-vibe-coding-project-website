// Analytics figures for the screen. Pure functions: no React, no network.
// Every number comes from the site_analytics() row; nothing here is typed in.

export const RANGES = [7, 30, 90];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatCount(n) {
  return n === null || n === undefined ? '–' : Number(n).toLocaleString('en-CA');
}

// 45000 → "45s", 125000 → "2m 05s", 3720000 → "1h 02m"
export function formatDuration(ms) {
  if (ms === null || ms === undefined) return '–';
  const s = Math.round(Number(ms) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, '0')}s`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
}

export function formatPercent(v) {
  if (v === null || v === undefined) return '–';
  const n = Number(v);
  return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}%`;
}

export function formatRatio(v) {
  return v === null || v === undefined ? '–' : Number(v).toFixed(2);
}

// "2026-11-20" → "Nov 20" (a calendar day, read without a time zone shift)
export function formatDay(day) {
  const [, m, d] = String(day).split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

// How a figure moved against the previous period, in words. Percent change for
// counts and times; percentage points for rates. No judgement of good or bad:
// a lower bounce rate is usually better, more visitors usually better, but the
// reader decides.
export function changeText(cur, prev, kind, days) {
  const span = `the previous ${days} days`;
  if (cur === null || cur === undefined || prev === null || prev === undefined) {
    return `No data for ${span}`;
  }
  const c = Number(cur);
  const p = Number(prev);
  if (kind === 'rate') {
    const pts = Math.round((c - p) * 10) / 10;
    if (pts === 0) return `Same as ${span}`;
    return `${pts > 0 ? 'Up' : 'Down'} ${Math.abs(pts)} points on ${span}`;
  }
  if (p === 0) return c === 0 ? `Same as ${span}` : `New since ${span}`;
  const pct = Math.round(((c - p) / p) * 100);
  if (pct === 0) return `Same as ${span}`;
  return `${pct > 0 ? 'Up' : 'Down'} ${Math.abs(pct)}% on ${span}`;
}

// The five headline tiles.
export function kpiTiles(data) {
  const c = data.current || {};
  const p = data.previous || {};
  const d = data.days;
  const prevOrNull = (k) => (Number(p.page_views || 0) === 0 ? null : p[k]);
  return [
    {
      id: 'visitors',
      label: 'Visitors',
      value: formatCount(c.visitors),
      note: changeText(c.visitors, prevOrNull('visitors'), 'count', d),
    },
    {
      id: 'views',
      label: 'Page views',
      value: formatCount(c.page_views),
      note: changeText(c.page_views, prevOrNull('page_views'), 'count', d),
    },
    {
      id: 'per-visit',
      label: 'Views per visit',
      value: formatRatio(c.views_per_visit),
      note: changeText(c.views_per_visit, prevOrNull('views_per_visit'), 'count', d),
    },
    {
      id: 'duration',
      label: 'Avg. visit duration',
      value: formatDuration(c.avg_visit_ms),
      note: changeText(c.avg_visit_ms, prevOrNull('avg_visit_ms'), 'count', d),
    },
    {
      id: 'bounce',
      label: 'Bounce rate',
      value: formatPercent(c.bounce_rate),
      note: changeText(c.bounce_rate, prevOrNull('bounce_rate'), 'rate', d),
    },
  ];
}

export function isEmpty(data) {
  return !data || !data.current || Number(data.current.page_views || 0) === 0;
}

// Top of the y axis: the smallest "nice" number (1, 2 or 5 × 10^k) at or above the
// largest value, never below 4 so a quiet week still has a readable scale.
export function niceMax(v) {
  const n = Number(v) || 0;
  if (n <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(n));
  for (const step of [1, 2, 5, 10]) if (step * pow >= n) return step * pow;
  return 10 * pow;
}

// Geometry for the trend chart: one point per day for each series, in a
// width × height box with room for the axes.
export function chartModel(series, keys, { width, height, pad, maxLabels = 6 }) {
  const list = series || [];
  const max = niceMax(Math.max(0, ...list.flatMap((d) => keys.map((k) => Number(d[k]) || 0))));
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const x = (i) => pad.left + (list.length < 2 ? innerW / 2 : (i * innerW) / (list.length - 1));
  const y = (v) => pad.top + innerH - (Number(v) / max) * innerH;
  const lines = Object.fromEntries(
    keys.map((k) => [
      k,
      list.map((d, i) => ({ x: x(i), y: y(Number(d[k]) || 0), value: Number(d[k]) || 0 })),
    ]),
  );
  const ticks = [0, max / 2, max].map((v) => ({ value: v, y: y(v) }));
  const step = Math.max(1, Math.ceil(list.length / maxLabels));
  const xLabels = list
    .map((d, i) => ({ i, x: x(i), text: formatDay(d.day) }))
    .filter(({ i }) => i % step === 0 || i === list.length - 1)
    .filter((l, idx, all) => idx === all.length - 1 || all[all.length - 1].i - l.i >= step * 0.8);
  return { max, lines, ticks, xLabels, x, y, innerW, innerH };
}

// "20 Nov 2026, 14:05" in the reader's time zone
export function formatTime(iso) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
}

// Index of the day nearest a horizontal position.
export function nearestIndex(px, count, { width, pad }) {
  if (count < 2) return 0;
  const innerW = width - pad.left - pad.right;
  const i = Math.round(((px - pad.left) / innerW) * (count - 1));
  return Math.min(count - 1, Math.max(0, i));
}

// Keep two end labels from overlapping: push them at least `gap` apart.
export function separate(a, b, gap) {
  if (Math.abs(a - b) >= gap) return [a, b];
  const mid = (a + b) / 2;
  return a <= b ? [mid - gap / 2, mid + gap / 2] : [mid + gap / 2, mid - gap / 2];
}

export function pageLabel(id, routes) {
  const r = routes.find((x) => x.id === id);
  return r ? r.label : id;
}
