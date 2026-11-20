import { formatCount, formatDuration, pageLabel } from '../logic/analytics.js';

// Every page that was viewed in the period, most viewed first.
export default function TopPages({ copy, pages, routes }) {
  return (
    <section className="ra-sec" aria-labelledby="an-pages-h">
      <h3 id="an-pages-h">{copy.pagesHeading}</h3>
      <div className="tablewrap">
        <table className="inv-table an-pages">
          <thead>
            <tr>
              <th scope="col">{copy.page}</th>
              <th scope="col" className="num">
                {copy.pageViews}
              </th>
              <th scope="col" className="num">
                {copy.visitors}
              </th>
              <th scope="col" className="num">
                {copy.avgTime}
              </th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.page}>
                <th scope="row">
                  <a href={`#${p.page}`}>{pageLabel(p.page, routes)}</a>
                </th>
                <td className="num">{formatCount(p.page_views)}</td>
                <td className="num">{formatCount(p.visitors)}</td>
                <td className="num">{formatDuration(p.avg_time_ms)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
