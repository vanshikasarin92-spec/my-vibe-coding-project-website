// Renders the small inline markup used in data files (features/*/data, shared/data), so content files stay
// plain text with no JSX:
//   `code`   **strong**   _em_   ==mark==   [label](https://link)
// Anything else is shown as text. React escapes it, so data can't inject HTML.

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|_[^_]+_|==[^=]+==|\[[^\]]+\]\([^)\s]+\))/g;

function renderToken(tok, key) {
  if (tok.startsWith('`')) return <code key={key}>{tok.slice(1, -1)}</code>;
  if (tok.startsWith('**')) return <strong key={key}>{tok.slice(2, -2)}</strong>;
  if (tok.startsWith('==')) return <mark key={key}>{tok.slice(2, -2)}</mark>;
  if (tok.startsWith('[')) {
    const m = tok.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    return (
      <a key={key} href={m[2]}>
        {m[1]}
      </a>
    );
  }
  return <em key={key}>{tok.slice(1, -1)}</em>;
}

export default function RichText({ text }) {
  if (!text) return null;
  return text
    .split(TOKEN)
    .map((part, i) => (i % 2 === 1 ? renderToken(part, i) : part))
    .filter((p) => p !== '');
}
