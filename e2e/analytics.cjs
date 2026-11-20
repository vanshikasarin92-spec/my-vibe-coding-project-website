// Browser test for the Analytics page: every state, the chart's hover and
// keyboard reading, and that test runs are not counted as visits.
// Run: npm run build && npm run preview (port 4173), then: node e2e/analytics.cjs [shots-dir]
const { chromium } = require('playwright');
const BASE = 'http://localhost:4173/';
const SHOTS = process.argv[2];
const UID = '11111111-2222-4333-8444-555555555555';
let pass = 0, fail = 0;
const ok = (n, c, x = '') => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', n, x); };
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
const json = (r, body, status = 200) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
const now = () => Math.floor(Date.now() / 1000);
const USER = { id: UID, aud: 'authenticated', role: 'authenticated', email: 'pat@example.com', identities: [{ id: '1' }] };

// Stand-in figures (made up for the test, not real traffic).
const days = (n) => Array.from({ length: n }, (_, i) => {
  const d = new Date(Date.UTC(2026, 10, 20 - (n - 1 - i)));
  const visitors = i % 7 === 5 || i % 7 === 6 ? 2 + (i % 3) : 6 + ((i * 5) % 9);
  return { day: d.toISOString().slice(0, 10), visitors, page_views: visitors * 3 + (i % 4) };
});
const FIG = (n) => ({
  days: n,
  current: { visitors: 64, page_views: 412, visits: 151, views_per_visit: 2.73, avg_visit_ms: 263000, bounce_rate: 38.4 },
  previous: { visitors: 52, page_views: 360, visits: 140, views_per_visit: 2.57, avg_visit_ms: 241000, bounce_rate: 41.2 },
  series: days(n),
  pages: [
    { page: 'role', page_views: 140, visitors: 58, avg_time_ms: 95000 },
    { page: 'checklists', page_views: 88, visitors: 31, avg_time_ms: 182000 },
    { page: 'news', page_views: 61, visitors: 29, avg_time_ms: 41000 },
    { page: 'analytics', page_views: 12, visitors: 2, avg_time_ms: 30000 },
  ],
  as_of: new Date().toISOString(),
});
const EMPTY = { days: 30, current: { visitors: 0, page_views: 0, visits: 0, views_per_visit: null, avg_visit_ms: null, bounce_rate: null }, previous: { visitors: 0, page_views: 0, visits: 0 }, series: days(30).map((d) => ({ ...d, visitors: 0, page_views: 0 })), pages: [], as_of: new Date().toISOString() };

(async () => {
  const b = await chromium.launch({ proxy });
  const errs = [];
  const writes = [];
  const setup = async (analytics, viewport = { width: 1280, height: 900 }) => {
    const ctx = await b.newContext({ ignoreHTTPSErrors: true, viewport });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(e.message));
    const asked = [];
    await p.route('**/auth/v1/**', (r) => json(r, { access_token: 't', token_type: 'bearer', expires_in: 3600, expires_at: now() + 3600, refresh_token: 'r', user: USER }));
    await p.route('**/rest/v1/**', (r) => {
      const req = r.request();
      const path = new URL(req.url()).pathname;
      if (req.method() !== 'GET') writes.push(path);
      if (path.endsWith('/rpc/site_analytics')) {
        const n = JSON.parse(req.postData() || '{}').days;
        asked.push(n);
        return analytics(r, n);
      }
      if (path.includes('/rpc/')) return json(r, null);
      return json(r, req.method() === 'GET' ? [] : null, req.method() === 'GET' ? 200 : 201);
    });
    return { ctx, p, asked };
  };
  const signIn = async (p) => {
    await p.goto(BASE + '#account');
    await p.fill('#acc-email', 'pat@example.com');
    await p.fill('#acc-password', 'correct-horse-1');
    await p.click('button[type=submit]');
    await p.waitForSelector('text=Signed in as', { timeout: 10000 });
  };

  // Signed out
  let { ctx, p, asked } = await setup((r, n) => json(r, FIG(n)));
  await p.goto(BASE + '#analytics');
  await p.waitForSelector('#h-analytics');
  ok('menu has Analytics', await p.isVisible('nav a[href="#analytics"]'));
  ok('signed out: empty state with Get started → sign in', (await p.textContent('#v-analytics')).includes('Sign in to see analytics') && (await p.getAttribute('#v-analytics .state-empty a', 'href')) === '#account');
  ok('signed out: figures never requested', asked.length === 0);

  // Signed in with data
  await signIn(p);
  await p.goto(BASE + '#analytics');
  await p.waitForSelector('.an-tiles');
  const tiles = await p.$$eval('.an-tiles .inv-tile', (ts) => Object.fromEntries(ts.map((t) => [t.dataset.tile, [t.querySelector('.inv-value').textContent, t.querySelector('.inv-note').textContent]])));
  ok('tiles: visitors, page views, views per visit, duration, bounce', tiles.visitors[0] === '64' && tiles.views[0] === '412' && tiles['per-visit'][0] === '2.73' && tiles.duration[0] === '4m 23s' && tiles.bounce[0] === '38.4%', JSON.stringify(tiles));
  ok('tiles: change vs previous period in words', tiles.visitors[1] === 'Up 23% on the previous 30 days' && tiles.bounce[1] === 'Down 2.8 points on the previous 30 days');
  ok('default period is 30 days', asked.at(-1) === 30 && (await p.getAttribute('.an-range button[aria-pressed=true]', 'aria-pressed')) === 'true' && (await p.textContent('.an-range button[aria-pressed=true]')).includes('30'));
  ok('chart: two lines, one point per day', (await p.$$('.an-line')).length === 2 && (await p.$$eval('.an-line', (ls) => ls[0].getAttribute('d').split('L').length)) === 30);
  ok('chart: legend and end labels name both series', (await p.textContent('.an-legend')).includes('Page views') && (await p.textContent('.an-endlabels')).includes('Visitors'));
  await p.locator('.an-plot svg').scrollIntoViewIfNeeded();
  const box = await p.locator('.an-plot svg').boundingBox();
  await p.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await p.waitForSelector('.an-tip');
  ok('hover: tooltip shows the day and both values', /Nov \d+/.test(await p.textContent('.an-tip')) && (await p.$$('.an-dot')).length === 2);
  if (SHOTS) await p.screenshot({ path: `${SHOTS}/desktop-hover.png`, fullPage: true });
  await p.mouse.move(0, 0);
  await p.focus('.an-plot svg');
  await p.keyboard.press('End');
  const endRead = await p.textContent('#an-readout');
  await p.keyboard.press('ArrowLeft');
  const prevRead = await p.textContent('#an-readout');
  ok('keyboard: End then Left reads the last two days aloud', endRead.includes('Nov 20') && prevRead.includes('Nov 19'), `${endRead} | ${prevRead}`);
  await p.click('.an-table summary');
  ok('table view: one row per day', (await p.$$('.an-table tbody tr')).length === 30);
  const pages = await p.$$eval('.an-pages tbody tr', (rs) => rs.map((r) => r.textContent));
  ok('pages table: menu names, most viewed first, times formatted', pages[0].startsWith('Your role') && pages[0].includes('1m 35s') && pages.length === 4, pages[0]);
  await p.click('.an-range button:has-text("Last 7 days")');
  await p.waitForFunction(() => document.querySelectorAll('.an-table tbody tr').length === 7 || document.querySelector('.an-tiles'));
  await p.waitForTimeout(300);
  ok('7 days: figures re-requested for 7 days', asked.at(-1) === 7 && (await p.$$eval('.an-line', (ls) => ls[0].getAttribute('d').split('L').length)) === 7);
  await p.click('.an-how summary');
  ok('definitions are on the page', (await p.textContent('.an-how')).includes('A visit ends after 30 minutes'));
  ok('local test run: no page views recorded', !writes.some((w) => w.endsWith('/page_views')), writes.join());
  await ctx.close();

  // Mobile width: nothing wider than the screen
  ({ ctx, p } = await setup((r, n) => json(r, FIG(n)), { width: 390, height: 844 }));
  await signIn(p);
  await p.goto(BASE + '#analytics');
  await p.waitForSelector('.an-tiles');
  ok('phone: no sideways scrolling', await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  if (SHOTS) await p.screenshot({ path: `${SHOTS}/phone.png`, fullPage: true });
  await ctx.close();

  // Empty and error states
  let failNext = true;
  ({ ctx, p } = await setup((r, n) => (failNext ? r.abort('failed') : json(r, EMPTY))));
  await signIn(p);
  await p.goto(BASE + '#analytics');
  await p.waitForSelector('#v-analytics .state-error', { timeout: 12000 });
  ok('load fails: inline error with Retry', await p.isVisible('#v-analytics .state-error button:has-text("Retry")'));
  failNext = false;
  await p.click('#v-analytics .state-error button:has-text("Retry")');
  await p.waitForSelector('#v-analytics .state-empty');
  ok('Retry → no visits yet: empty state with actions', (await p.textContent('#v-analytics .state-empty')).includes('No visits recorded in the last 30 days') && (await p.isVisible('button:has-text("Copy the hub link")')) && (await p.isVisible('button:has-text("Show the last 90 days")')));
  if (SHOTS) await p.screenshot({ path: `${SHOTS}/empty.png` });
  await p.click('button:has-text("Show the last 90 days")');
  await p.waitForSelector('.an-range button[aria-pressed=true]:has-text("90")');
  ok('empty: "Show the last 90 days" switches the period', true);
  await ctx.close();

  ok('no page errors', errs.length === 0, errs.join(' | '));
  await b.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
