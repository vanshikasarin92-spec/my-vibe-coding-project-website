import { TOOLS, PRACTICES } from './data/testing.js';
import RichText from '../../shared/components/RichText.jsx';

// Testing & tools: toolkit table and testing practices.
export default function Testing() {
  return (
    <section className="view" id="v-testing" aria-labelledby="h-testing">
      <div className="view-head">
        <h2 id="h-testing">Testing and tools</h2>
        <p className="lede">
          Automated scanners find a portion of issues quickly. Keyboard, screen reader and zoom
          passes find the rest. Usability testing with disabled people finds what neither catches.
        </p>
      </div>
      <div className="tablewrap">
        <table>
          <caption>Recommended toolkit</caption>
          <thead>
            <tr>
              <th scope="col">Tool</th>
              <th scope="col">Platform</th>
              <th scope="col">Used by</th>
              <th scope="col">Best for</th>
            </tr>
          </thead>
          <tbody>
            {TOOLS.map((tool) => (
              <tr key={tool.name}>
                <th scope="row">
                  <RichText text={tool.name} />
                </th>
                <td>{tool.platform}</td>
                <td>{tool.usedBy}</td>
                <td>{tool.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cards">
        {PRACTICES.map((p) => (
          <div key={p.title} className="card">
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            {p.link && (
              <p className="meta">
                <a href={p.link.href}>{p.link.label}</a>
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
