// Footer with the page's own contrast ratios, from ../data/site.js.

import { SITE } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="site">
      <p>{SITE.footer}</p>
      <div className="swatches" aria-label="This page's own colour contrast">
        {SITE.swatches.map((s) => (
          <span key={s.token}>
            <i style={{ background: `var(${s.token})` }}></i>
            {s.text}
          </span>
        ))}
      </div>
    </footer>
  );
}
