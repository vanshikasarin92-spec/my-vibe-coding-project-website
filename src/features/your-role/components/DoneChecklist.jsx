// A role's definition of done (or pull-request checklist), with a button that
// copies it as Markdown checkboxes plus a link back to the hub.
export default function DoneChecklist({ dod, L, status, preRef, onCopy }) {
  return (
    <section className="ra-sec ra-dod" aria-labelledby="ra-dod-h">
      <h3 id="ra-dod-h">{dod.title}</h3>
      <p>{dod.intro}</p>
      <ul className="list ra-dod-list" ref={preRef}>
        {dod.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p id="ra-dod-hint" className="small muted">
        {L.dodHint}
      </p>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          data-act="dod"
          aria-describedby="ra-dod-hint"
          onClick={onCopy}
        >
          {L.dodCopy}
        </button>
        <span className="ra-status" role="status">
          {status}
        </span>
      </div>
    </section>
  );
}
