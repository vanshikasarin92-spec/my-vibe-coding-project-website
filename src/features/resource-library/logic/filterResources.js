// Resource library filtering and counts. Pure functions over data/resources.js.

// Resource library. Each item is [title, href, description, roleIds].
export function resourceCount(groups, roleId) {
  return groups.reduce(
    (n, g) => n + g.items.filter((it) => roleId === 'all' || it[3].includes(roleId)).length,
    0,
  );
}

// Groups with only the items that match the role and keyword; empty groups dropped.
// roleLabels maps role id to label so a search for "developer" finds developer items.
export function filterResources(groups, roleId, query, roleLabels) {
  const q = query.trim().toLowerCase();
  return groups
    .map((g) => ({
      ...g,
      hits: g.items.filter((it) => {
        if (roleId !== 'all' && !it[3].includes(roleId)) return false;
        if (!q) return true;
        const text = [g.g, it[0], it[2], ...it[3].map((r) => roleLabels[r])].join(' ');
        return text.toLowerCase().includes(q);
      }),
    }))
    .filter((g) => g.hits.length);
}

export function hitCount(filteredGroups) {
  return filteredGroups.reduce((n, g) => n + g.hits.length, 0);
}

// Pagination across groups: list every hit with its group, take one page, then
// group again so each page keeps its group headings.
export function flattenHits(filteredGroups) {
  return filteredGroups.flatMap((g) => g.hits.map((item) => ({ group: g.g, item })));
}

export function regroup(entries) {
  const out = [];
  entries.forEach(({ group, item }) => {
    const last = out[out.length - 1];
    if (last && last.g === group) last.hits.push(item);
    else out.push({ g: group, hits: [item] });
  });
  return out;
}
