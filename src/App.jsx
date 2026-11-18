// App shell: picks the feature page for the URL hash (#role, #news, …) and moves
// focus to its heading when the page changes.

import { useEffect, useRef } from 'react';
import Layout from './shared/components/Layout.jsx';
import { ROUTES, EXTRA_ROUTES, DEFAULT_ROUTE } from './shared/data/routes.js';
import { SITE } from './shared/data/site.js';
import { pageTitle } from './shared/logic/navigation.js';
import { useHashRoute } from './shared/hooks/useHashRoute.js';
import YourRole from './features/your-role/YourRole.jsx';
import Overview from './features/overview/Overview.jsx';
import News from './features/news/News.jsx';
import Standards from './features/standards/Standards.jsx';
import Platforms from './features/platforms/Platforms.jsx';
import Checklists from './features/checklists/Checklists.jsx';
import Testing from './features/testing/Testing.jsx';
import Research from './features/research/Research.jsx';
import Trends from './features/trends/Trends.jsx';
import ResourceLibrary from './features/resource-library/ResourceLibrary.jsx';
import Account from './features/account/Account.jsx';

const PAGES = {
  role: YourRole,
  start: Overview,
  news: News,
  standards: Standards,
  platforms: Platforms,
  checklists: Checklists,
  testing: Testing,
  research: Research,
  trends: Trends,
  resources: ResourceLibrary,
  account: Account,
};

// Hash routing (#role, #news, …) keeps links from the original hub working and
// needs no server configuration.
const ROUTE_IDS = Object.keys(PAGES);

export default function App() {
  const view = useHashRoute(ROUTE_IDS, DEFAULT_ROUTE);
  const firstRender = useRef(true);

  useEffect(() => {
    document.title = pageTitle([...ROUTES, ...EXTRA_ROUTES], view, DEFAULT_ROUTE, SITE.name);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Move focus to the new page's heading so keyboard and screen reader users land on it.
    const heading = document.querySelector('#main h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }, [view]);

  const Page = PAGES[view];
  return (
    <Layout view={view}>
      <Page />
    </Layout>
  );
}
