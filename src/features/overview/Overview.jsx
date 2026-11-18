import { BUILD_STANDARD, POUR, STATS, TILES } from './data/overview.js';
import RichText from '../../shared/components/RichText.jsx';

// Overview: build standard, POUR principles, 2026 figures and jump-to tiles.
export default function Overview() {
  return (
    <section className="view" id="v-start" aria-labelledby="h-start">
      <div className="view-head">
        <h2 id="h-start">Everything Design and Engineering need to ship accessible products</h2>
        <p className="lede">
          Standards, the Accessible Canada Act, platform guidance, checklists, tools and research
          for websites, iOS and Android apps, kept in one place and dated so you know how current it
          is.
        </p>
      </div>
      <div className="baseline">
        <div className="block">
          <span className="eyebrow">{BUILD_STANDARD.eyebrow}</span>
          <p className="big">
            <RichText text={BUILD_STANDARD.statement} />
          </p>
          <p className="small muted">{BUILD_STANDARD.note}</p>
        </div>
        <div className="block">
          <span className="eyebrow">The four principles (POUR)</span>
          <div className="pour">
            {POUR.map((p) => (
              <div key={p.name}>
                <b>{p.name}</b>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="block">
        <h3>The state of things, 2026</h3>
        <div className="stats">
          {STATS.map((s) => (
            <div key={s.value + s.label} className="stat">
              <span className="v">{s.value}</span>
              <span className="l">{s.label}</span>
              <span className="src">{s.source}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="block">
        <h3>Jump to</h3>
        <div className="tiles">
          {TILES.map((tile) => (
            <a key={tile.href} className="tile" href={tile.href}>
              <b>{tile.title}</b>
              <span>{tile.text}</span>
              <span className="go">{tile.go} →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
