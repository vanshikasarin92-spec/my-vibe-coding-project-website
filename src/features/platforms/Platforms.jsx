import { useRef } from 'react';
import { PLATFORMS } from './data/platforms.js';
import { usePlatformTab } from './hooks/usePlatformTab.js';
import { tabIndexForKey } from '../../shared/logic/navigation.js';
import PlatformPanel from './components/PlatformPanel.jsx';

// Web & mobile guides: one tab per platform (WAI-ARIA tabs pattern), last tab remembered.
export default function Platforms() {
  const [active, setActive] = usePlatformTab((v) => PLATFORMS.some((p) => p.id === v));
  const tabRefs = useRef({});

  function onKeyDown(e, i) {
    const next = tabIndexForKey(e.key, i, PLATFORMS.length);
    if (next === null) return;
    e.preventDefault();
    const id = PLATFORMS[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  }

  return (
    <section className="view" id="v-platforms" aria-labelledby="h-platforms">
      <div className="view-head">
        <h2 id="h-platforms">Web and mobile guides</h2>
        <p className="lede">
          The same WCAG outcomes, implemented with each platform's own APIs and assistive
          technology. Test in both English and French wherever the product ships in both.
        </p>
      </div>
      <div>
        <div className="tablist" role="tablist" aria-label="Platform">
          {PLATFORMS.map((p, i) => (
            <button
              key={p.id}
              ref={(el) => {
                tabRefs.current[p.id] = el;
              }}
              className="tab"
              role="tab"
              id={'t-' + p.id}
              aria-controls={'p-' + p.id}
              aria-selected={active === p.id}
              tabIndex={active === p.id ? 0 : -1}
              onClick={() => setActive(p.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {PLATFORMS.map((p) => (
          <div
            key={p.id}
            className="panel"
            role="tabpanel"
            id={'p-' + p.id}
            aria-labelledby={'t-' + p.id}
            tabIndex={0}
            hidden={active !== p.id}
          >
            <PlatformPanel platform={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
