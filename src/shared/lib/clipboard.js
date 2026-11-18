// Copy text to the clipboard. Resolves true on success. If the clipboard is
// unavailable, it selects the text in `fallbackNode` so people can copy it with
// the keyboard, and resolves false.

export function copyText(text, fallbackNode) {
  const selectFallback = () => {
    try {
      const range = document.createRange();
      range.selectNodeContents(fallbackNode);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {
      /* selection unavailable */
    }
    return false;
  };
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true, selectFallback);
    }
  } catch (e) {
    /* fall through */
  }
  return Promise.resolve(selectFallback());
}
