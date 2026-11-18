// Pagination rules. Pure functions.

// One page of `items`. `page` is 1-based and clamped to the pages that exist,
// so a filter that shrinks the list never leaves the reader on an empty page.
export function paginate(items, page, size) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(Math.max(1, page || 1), pages);
  const start = (current - 1) * size;
  const end = Math.min(start + size, total);
  return {
    page: current,
    pages,
    total,
    from: total ? start + 1 : 0,
    to: end,
    items: items.slice(start, end),
  };
}

// Page numbers to show: all of them up to 7, otherwise first, last and the
// neighbours of the current page, with null marking a gap.
export function pageNumbers(current, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const keep = new Set([1, pages, current - 1, current, current + 1]);
  const out = [];
  for (let n = 1; n <= pages; n++) {
    if (keep.has(n)) out.push(n);
    else if (out[out.length - 1] !== null) out.push(null);
  }
  return out;
}
