import { Fragment } from 'react';
import RichText from '../../../shared/components/RichText.jsx';

// One platform tab's content: design and build lists, key APIs, references, test setup.
export default function PlatformPanel({ platform }) {
  return (
    <>
      <div className="cols2">
        <div className="block">
          <h3>Design</h3>
          <ul className="list">
            {platform.design.map((s) => (
              <li key={s}>
                <RichText text={s} />
              </li>
            ))}
          </ul>
        </div>
        <div className="block">
          <h3>Build</h3>
          <ul className="list">
            {platform.build.map((s) => (
              <li key={s}>
                <RichText text={s} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="block">
        <h4>Key APIs and references</h4>
        <div className="apis">
          {platform.apis.map((a) => (
            <code key={a}>{a}</code>
          ))}
        </div>
        <p className="small">
          {platform.references.map((ref, i) => (
            <Fragment key={ref.href}>
              {i > 0 && ' · '}
              <a href={ref.href}>{ref.label}</a>
            </Fragment>
          ))}
        </p>
      </div>
      <div className="block">
        <h4>Test with</h4>
        <p className="small">
          <RichText text={platform.testWith} />
        </p>
      </div>
    </>
  );
}
