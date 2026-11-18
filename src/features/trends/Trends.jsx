import { TRENDS } from './data/trends.js';

// Trends to plan for.
export default function Trends() {
  return (
    <section className="view" id="v-trends" aria-labelledby="h-trends">
      <div className="view-head">
        <h2 id="h-trends">Trends to plan for</h2>
        <p className="lede">
          What's shifting in 2026 and 2027, and what each shift asks of Design and Engineering.
        </p>
      </div>
      <div>
        {TRENDS.map((trend) => (
          <div key={trend.title} className="trend">
            <h3>{trend.title}</h3>
            <div>
              <span className="lbl">Signal</span>
              <p>{trend.signal}</p>
            </div>
            <div>
              <span className="lbl">Our response</span>
              <p>{trend.response}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
