// Checklist progress. Pure functions over ticks: { [itemId]: true|false }.

export function doneCount(items, ticks) {
  return items.filter((it) => ticks[it.id]).length;
}

export function clearTicks(items, ticks) {
  const next = { ...ticks };
  items.forEach((it) => {
    next[it.id] = false;
  });
  return next;
}
