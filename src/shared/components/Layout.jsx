// Page frame: skip link, header, side menu and main area. Content from ../data/site.js.

import { ROUTES } from '../data/routes.js';
import { SITE } from '../data/site.js';
import Footer from './Footer.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Layout({ view, children }) {
  const auth = useAuth();
  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>

      <header className="masthead">
        <div className="masthead-in">
          <div className="brand">
            <span className="eyebrow">{SITE.eyebrow}</span>
            <h1>
              Accessible <span>by Default</span>
            </h1>
          </div>
          <div className="mast-meta">
            {SITE.chips.map((c) => (
              <span key={c.text} className={c.kind ? 'chip ' + c.kind : 'chip'}>
                {c.text}
              </span>
            ))}
            <span className="chip">{SITE.updated}</span>
            {auth.status !== 'unavailable' && (
              <a
                className="acc-link"
                href="#analytics"
                aria-current={view === 'analytics' ? 'page' : undefined}
              >
                {SITE.analytics}
              </a>
            )}
            {auth.status !== 'unavailable' && (
              <a
                className="acc-link"
                href="#account"
                aria-current={view === 'account' ? 'page' : undefined}
              >
                {auth.status === 'signed-in' ? SITE.account.signedIn : SITE.account.signIn}
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="shell">
        <nav className="rail" aria-label="Hub sections">
          <ul>
            {ROUTES.map((r, i) => (
              <li key={r.id}>
                <a href={'#' + r.id} aria-current={r.id === view ? 'page' : undefined}>
                  {r.label} <span className="n">{String(i + 1).padStart(2, '0')}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="rail-note">{SITE.railNote}</p>
        </nav>

        <main id="main" tabIndex={-1}>
          {children}
          <Footer />
        </main>
      </div>
    </>
  );
}
