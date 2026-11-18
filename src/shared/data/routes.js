// Section order for the side menu. Each id is also the URL hash (#role, #news, …).
export const ROUTES = [
  { id: 'role', label: 'Your role' },
  { id: 'start', label: 'Overview' },
  { id: 'news', label: 'Latest news' },
  { id: 'standards', label: 'Standards & law' },
  { id: 'platforms', label: 'Web & mobile guides' },
  { id: 'checklists', label: 'Checklists' },
  { id: 'testing', label: 'Testing & tools' },
  { id: 'research', label: 'Research & data' },
  { id: 'trends', label: 'Trends' },
  { id: 'resources', label: 'Resource library' },
];

// Pages reached from the header rather than the side menu.
export const EXTRA_ROUTES = [{ id: 'account', label: 'Your account' }];

export const DEFAULT_ROUTE = 'role';
