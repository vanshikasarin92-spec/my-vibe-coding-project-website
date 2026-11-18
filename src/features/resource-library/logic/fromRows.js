// Turns Supabase resource rows into the shape the Resource library uses (same as
// data/resources.js: [{ g, items: [[title, url, description, roleIds]] }]).
// Role chips follow the filter's role order, so they read the same everywhere.

export function orderRoles(roleIds, order) {
  return [...roleIds].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

export function resourcesFromRows(rows, roleOrder) {
  return (rows || []).map((g) => ({
    g: g.name,
    items: [...(g.resources || [])]
      .sort((a, b) => a.position - b.position)
      .map((r) => [
        r.title,
        r.url,
        r.description,
        orderRoles(
          (r.resource_roles || []).map((x) => x.library_role_id),
          roleOrder,
        ),
      ]),
  }));
}

// The bundled copy, with chips in the same order, for when Supabase isn't configured.
export function orderBundled(groups, roleOrder) {
  return groups.map((g) => ({
    ...g,
    items: g.items.map((it) => [it[0], it[1], it[2], orderRoles(it[3], roleOrder)]),
  }));
}
