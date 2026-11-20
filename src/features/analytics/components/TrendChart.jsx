import { useEffect, useRef, useState } from 'react';
import { chartModel, nearestIndex, separate, formatDay, formatCount } from '../logic/analytics.js';

// Visitors and page views per day. Both series share one axis (both are counts).
// Read it three ways: hover (crosshair + tooltip), the keyboard (focus the chart,
// then Left/Right/Home/End), or the table under it.
const SERIES = ['page_views', 'visitors'];
const PAD = { top: 16, right: 92, bottom: 32, left: 40 };

// The chart is drawn at its real width, so its text stays full size on a phone
// instead of shrinking with the picture.
function useWidth(ref, fallback) {
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

export default function TrendChart({ copy, series, days }) {
  const [active, setActive] = useState(null);
  const plotRef = useRef(null);
  const width = useWidth(plotRef, 720);
  const narrow = width < 520;
  const BOX = { width, height: narrow ? 220 : 260, pad: PAD, maxLabels: narrow ? 4 : 6 };
  const m = chartModel(series, SERIES, BOX);
  const last = series.length - 1;
  const total = (k) => series.reduce((t, d) => t + (Number(d[k]) || 0), 0);
  const [labelViews, labelVisitors] = separate(
    m.lines.page_views[last]?.y ?? 0,
    m.lines.visitors[last]?.y ?? 0,
    16,
  );
  const path = (k) => m.lines[k].map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join('');

  const onPointer = (e) => {
    const svg = e.currentTarget;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * BOX.width;
    setActive(nearestIndex(px, series.length, BOX));
  };
  const onKey = (e) => {
    const cur = active === null ? last : active;
    const next = { ArrowLeft: cur - 1, ArrowRight: cur + 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(Math.min(last, Math.max(0, next)));
  };

  const a = active === null ? null : series[active];
  const ax = active === null ? 0 : m.lines.page_views[active].x;

  return (
    <section className="ra-sec an-trend" aria-labelledby="an-trend-h">
      <h3 id="an-trend-h">{copy.trendHeading}</h3>
      <ul className="an-legend" aria-hidden="true">
        {SERIES.map((k) => (
          <li key={k}>
            <span className={`an-swatch an-${k}`} />
            {copy.series[k]}
          </li>
        ))}
      </ul>
      <div className="an-plot" ref={plotRef}>
        <svg
          viewBox={`0 0 ${BOX.width} ${BOX.height}`}
          role="img"
          tabIndex={0}
          aria-label={copy.trendSummary(days, total('page_views'), total('visitors'))}
          aria-describedby="an-readout"
          onPointerMove={onPointer}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKey}
          onBlur={() => setActive(null)}
        >
          {m.ticks.map((t) => (
            <g key={t.value} className="an-grid">
              <line x1={BOX.pad.left} x2={BOX.width - BOX.pad.right} y1={t.y} y2={t.y} />
              <text x={BOX.pad.left - 8} y={t.y} dy="0.32em" textAnchor="end">
                {formatCount(t.value)}
              </text>
            </g>
          ))}
          {m.xLabels.map((l) => (
            <text key={l.i} className="an-xlabel" x={l.x} y={BOX.height - 8} textAnchor="middle">
              {l.text}
            </text>
          ))}
          {SERIES.map((k) => (
            <path key={k} className={`an-line an-${k}`} d={path(k)} />
          ))}
          {last >= 0 && (
            <g className="an-endlabels">
              <text x={BOX.width - BOX.pad.right + 8} y={labelViews} dy="0.32em">
                {copy.series.page_views}
              </text>
              <text x={BOX.width - BOX.pad.right + 8} y={labelVisitors} dy="0.32em">
                {copy.series.visitors}
              </text>
            </g>
          )}
          {a && (
            <g className="an-active">
              <line x1={ax} x2={ax} y1={BOX.pad.top} y2={BOX.height - BOX.pad.bottom} />
              {SERIES.map((k) => (
                <circle
                  key={k}
                  className={`an-dot an-${k}`}
                  cx={ax}
                  cy={m.lines[k][active].y}
                  r="5"
                />
              ))}
            </g>
          )}
        </svg>
        {a && (
          <div
            className={`an-tip${ax > BOX.width * 0.6 ? ' an-tip-left' : ''}`}
            style={{ left: `${(ax / BOX.width) * 100}%` }}
            aria-hidden="true"
          >
            <strong>{formatDay(a.day)}</strong>
            {SERIES.map((k) => (
              <span key={k}>
                <span className={`an-swatch an-${k}`} />
                {copy.series[k]} <b>{formatCount(a[k])}</b>
              </span>
            ))}
          </div>
        )}
      </div>
      <p id="an-readout" className="vh" aria-live="polite">
        {a
          ? `${formatDay(a.day)}: ${formatCount(a.page_views)} page views, ${formatCount(a.visitors)} visitors.`
          : ''}
      </p>
      <details className="an-table">
        <summary>{copy.showTable}</summary>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th scope="col">{copy.day}</th>
                <th scope="col" className="num">
                  {copy.series.page_views}
                </th>
                <th scope="col" className="num">
                  {copy.series.visitors}
                </th>
              </tr>
            </thead>
            <tbody>
              {series.map((d) => (
                <tr key={d.day}>
                  <th scope="row">{formatDay(d.day)}</th>
                  <td className="num">{formatCount(d.page_views)}</td>
                  <td className="num">{formatCount(d.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
