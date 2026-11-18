import { STUDIES } from './data/research.js';

// Research & data: studies to cite.
export default function Research() {
  return (
    <section className="view" id="v-research" aria-labelledby="h-research">
      <div className="view-head">
        <h2 id="h-research">Research and data</h2>
        <p className="lede">
          Studies and datasets to cite in roadmaps, design reviews and business cases. Check the
          date on each before quoting it.
        </p>
      </div>
      <div className="cards">
        {STUDIES.map((s) => (
          <article key={s.title} className="card">
            <span className="meta">{s.meta}</span>
            <h3>
              <a href={s.href}>{s.title}</a>
            </h3>
            <p className="figure">{s.figure}</p>
            <p>{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
