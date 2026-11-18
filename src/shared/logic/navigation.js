// Routing and keyboard navigation rules. Pure functions.

// The page to show for a URL hash such as "#news". Unknown hashes fall back.
export function viewFromHash(hash, routeIds, fallback) {
  const id = (hash || '').replace(/^#/, '');
  return routeIds.includes(id) ? id : fallback;
}

export function pageTitle(routes, view, defaultView, siteName) {
  const route = routes.find((r) => r.id === view);
  return view === defaultView || !route ? siteName : route.label + ' · ' + siteName;
}

// Arrow-key tabs (WAI-ARIA tabs pattern): which tab index a key moves to, or null.
export function tabIndexForKey(key, current, count) {
  if (key === 'ArrowRight') return (current + 1) % count;
  if (key === 'ArrowLeft') return (current - 1 + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}
