// Browser test for loading skeletons, inline errors with Retry, empty states with
// Get started, pagination and last-write-wins.
// Run: npm run build && npm run preview (port 4173), then: node e2e/states.cjs
// Part 1 reads the live Supabase project; the rest stand in for Supabase's replies.
const { chromium } = require('playwright');
const path = require('path');
const BASE = 'http://localhost:4173/';
const UID = '11111111-2222-4333-8444-555555555555';
let pass = 0, fail = 0;
const ok = (n, c, x = '') => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', n, x); };
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
const focusedId = (p) => p.evaluate(() => document.activeElement && document.activeElement.id);

(async () => {
  const root = path.resolve(__dirname, '..');
  const { NEWS } = await import(path.join(root, 'src/features/news/data/news.js'));
  const { RES, ROLES } = await import(path.join(root, 'src/features/resource-library/data/resources.js'));
  const b = await chromium.launch({ proxy });
  const errs = [];
  const fresh = async () => {
    const ctx = await b.newContext({ ignoreHTTPSErrors: true });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(e.message));
    return { ctx, p };
  };

  // 1. Live Supabase: content matches the data files; pagination works
  let { ctx, p } = await fresh();
  await p.goto(BASE + '#news');
  await p.waitForSelector('#news-list', { timeout: 15000 });
  const firstPage = await p.$$eval('#news-list h3', (hs) => hs.map((h) => h.textContent));
  ok('live news, page 1 = first 5 items of the data file, in order', JSON.stringify(firstPage) === JSON.stringify(NEWS.slice(0, 5).map((n) => n.title)));
  ok('range text', (await p.textContent('.pager-range')).includes('1–5 of ' + NEWS.length));
  await p.click('.pager-num[aria-label="Page 3"]');
  const last = await p.$$eval('#news-list h3', (hs) => hs.map((h) => h.textContent));
  ok('page 3 shows the last item', JSON.stringify(last) === JSON.stringify(NEWS.slice(10).map((n) => n.title)));
  ok('page change moves focus to the heading', (await focusedId(p)) === 'h-news');
  ok('current page marked', (await p.getAttribute('.pager-num[aria-current=page]', 'aria-label')) === 'Page 3');
  ok('Next disabled on last page', await p.isDisabled('.pager button:has-text("Next")'));
  const src = await p.$$eval('#news-list .src-line a', (as) => as.map((a) => a.getAttribute('href')));
  ok('news sources come through in order', JSON.stringify(src) === JSON.stringify(NEWS.slice(10).flatMap((n) => n.sources.map((s) => s.href))));

  await p.goto(BASE + '#resources');
  await p.waitForSelector('.res-group', { timeout: 15000 });
  await p.click('button.toggle:has-text("All roles")').catch(() => {});
  await p.waitForSelector('.pager-range');
  const totalRes = RES.reduce((n, g) => n + g.items.length, 0);
  ok('live library: 10 per page of ' + totalRes, (await p.textContent('.pager-range')).includes('1–10 of ' + totalRes));
  const order = ROLES.filter((r) => r.id !== 'all').map((r) => r.id);
  const expectTitles = RES.flatMap((g) => g.items.map((it) => it[0]));
  const seen = [];
  for (let i = 1; i <= Math.ceil(totalRes / 10); i++) {
    if (i > 1) await p.click(`.pager-num[aria-label="Page ${i}"]`);
    seen.push(...(await p.$$eval('.res-group li > a', (as) => as.map((a) => a.textContent))));
  }
  ok('every resource appears once, in order, across pages', JSON.stringify(seen) === JSON.stringify(expectTitles), `(${seen.length})`);
  await p.fill('#resFilter', 'zzzz-nothing');
  await p.waitForSelector('.state-empty');
  ok('no match: empty state with Get started and Clear filters', (await p.isVisible('.state-empty a:has-text("Get started")')) && (await p.isVisible('.state-empty button:has-text("Clear filters")')));
  await p.click('.state-empty button:has-text("Clear filters")');
  ok('Clear filters brings everything back', (await p.textContent('.pager-range')).includes('of ' + totalRes));
  await ctx.close();

  // 2. Slow source: skeleton first, then content
  ({ ctx, p } = await fresh());
  await p.route('**/rest/v1/news_items**', async (r) => { await new Promise((res) => setTimeout(res, 2000)); r.continue(); });
  await p.goto(BASE + '#news');
  await p.waitForSelector('.skel');
  ok('slow load shows a skeleton', (await p.getAttribute('.skel', 'aria-busy')) === 'true' && (await p.textContent('.skel [role=status]')) === 'Loading news…');
  await p.waitForSelector('#news-list', { timeout: 15000 });
  ok('skeleton replaced by content', !(await p.isVisible('.skel')));
  await ctx.close();

  // 3. Failure: inline error, Retry recovers, focus moves to the heading
  ({ ctx, p } = await fresh());
  let failNext = true;
  await p.route('**/rest/v1/resource_groups**', (r) => (failNext ? r.abort('failed') : r.continue()));
  await p.goto(BASE + '#resources');
  await p.waitForSelector('.state-error');
  ok('failed load shows inline error with Retry', (await p.getAttribute('.state-error', 'role')) === 'alert' && (await p.isVisible('.state-error button:has-text("Retry")')));
  ok('no misleading counts while failed', !(await p.isVisible('.lib-controls .ct')));
  failNext = false;
  await p.click('.state-error button:has-text("Retry")');
  await p.waitForSelector('.res-group', { timeout: 15000 });
  ok('Retry loads the library', true);
  ok('Retry moves focus to the heading', (await focusedId(p)) === 'h-resources');
  await ctx.close();

  // 4. Timeout: a source that never answers becomes an error after 8 seconds
  ({ ctx, p } = await fresh());
  await p.route('**/rest/v1/news_items**', () => {}); // never answers
  await p.goto(BASE + '#news');
  await p.waitForSelector('.state-error', { timeout: 12000 });
  ok('hung source times out to the error state', true);
  await ctx.close();

  // 5. Empty source and empty filter
  ({ ctx, p } = await fresh());
  await p.route('**/rest/v1/news_items**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await p.goto(BASE + '#news');
  await p.waitForSelector('.state-empty');
  ok('no news: empty state with Get started', (await p.textContent('.state-empty-title')).includes('No news has been published'));
  await p.click('.state-empty a:has-text("Get started")');
  await p.waitForSelector('#h-role');
  ok('Get started goes to Your role', p.url().endsWith('#role'));
  await p.unroute('**/rest/v1/news_items**');
  await p.route('**/rest/v1/news_items**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 1, published_on: '2026-09-02', date_label: '2 Sep 2026', topic_id: 'canada', tag: 'Canada', title: 'Only item', body: 'b', means_lead: 'For us:', means: 'm', sources_label: 'Source:', news_sources: [] }]) }));
  await p.goto(BASE + '#news'); await p.waitForSelector('#news-list');
  await p.click('.toggles button:has-text("Mobile")');
  ok('empty topic: says which topic, offers Show all topics', (await p.textContent('.state-empty-title')).includes('No news on') && (await p.isVisible('.state-empty button:has-text("Show all topics")')));
  await p.click('.state-empty button:has-text("Show all topics")');
  ok('Show all topics restores the list', await p.isVisible('#news-list'));
  await ctx.close();

  // 6. Checklists: empty state, Get started focuses the first item
  ({ ctx, p } = await fresh());
  await p.goto(BASE + '#checklists'); await p.waitForSelector('#h-checklists');
  ok('no ticks: empty state shown', await p.isVisible('.state-empty:has-text("You haven\'t ticked anything yet")'));
  await p.click('.state-empty button:has-text("Get started")');
  ok('Get started focuses the first checklist item', await p.evaluate(() => document.activeElement.type === 'checkbox'));
  await p.keyboard.press('Space');
  ok('empty state goes away after the first tick', !(await p.isVisible('.state-empty')));
  await ctx.close();

  // 7. Signed in: last-write-wins and the account empty state
  const signIn = async (p, account) => {
    const now = Math.floor(Date.now() / 1000);
    const writes = [];
    await p.route('**/auth/v1/token**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ access_token: 't', token_type: 'bearer', expires_in: 3600, expires_at: now + 3600, refresh_token: 'r', user: { id: UID, aud: 'authenticated', role: 'authenticated', email: 'pat@example.com', identities: [{ id: '1' }] } }) }));
    await p.route('**/rest/v1/**', (r) => {
      const req = r.request(); const t = new URL(req.url()).pathname.split('/').pop();
      if (req.method() !== 'GET') { writes.push({ t, method: req.method(), body: req.postData() }); return r.fulfill({ status: 201, contentType: 'application/json', body: '[]' }); }
      if (t === 'profiles') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(account.profile) });
      if (t === 'action_completions') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(account.completions) });
      if (t === 'checklist_ticks') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(account.ticks) });
      return r.continue();
    });
    await p.goto(BASE + '#account'); await p.waitForSelector('#acc-email');
    await p.fill('#acc-email', 'pat@example.com'); await p.fill('#acc-password', 'correct-horse-1');
    await p.click('button[type=submit]');
    return writes;
  };

  ({ ctx, p } = await fresh());
  await signIn(p, { profile: { role_id: null, lang: 'en', library_role_id: null, client_updated_at: null }, completions: [], ticks: [] });
  await p.waitForSelector('#acc-saved ~ .state-empty, .state-empty', { timeout: 10000 });
  ok('account with nothing saved: Get started empty state', (await p.textContent('.state-empty-title')) === 'Nothing saved yet.' && (await p.getAttribute('.state-empty a', 'href')) === '#role');
  await ctx.close();

  ({ ctx, p } = await fresh());
  // This browser chose Developer an hour ago and ticked d1 an hour ago...
  await p.goto(BASE + '#role');
  const hourAgo = Date.now() - 3600e3;
  await p.evaluate((t) => {
    localStorage.setItem('abd-profile', JSON.stringify({ role: 'dev', lang: 'en', updatedAt: t, actions: {}, lastVisit: t }));
    localStorage.setItem('abd-checks', JSON.stringify({ d1: true, d2: true }));
    localStorage.setItem('abd-checks-at', JSON.stringify({ d1: t, d2: Date.now() }));
  }, hourAgo);
  // ...but on another device, 10 minutes ago, they switched to Product owner in French and unticked d1 and d2.
  const tenAgo = new Date(Date.now() - 600e3).toISOString();
  const writes = await signIn(p, {
    profile: { role_id: 'po', lang: 'fr', library_role_id: 'po', client_updated_at: tenAgo },
    completions: [],
    ticks: [{ item_id: 'd1', ticked: false, client_updated_at: tenAgo }, { item_id: 'd2', ticked: false, client_updated_at: tenAgo }],
  });
  await p.waitForSelector('.acc-saved, .state-empty', { timeout: 10000 });
  await p.goto(BASE + '#role'); await p.waitForSelector('#h-role');
  await p.waitForFunction(() => document.querySelector('#h-role').textContent.includes('Propriétaire de produit'), null, { timeout: 8000 }).catch(() => {});
  ok('LWW: newer account role and language win over this browser', (await p.textContent('#h-role')).includes('Propriétaire de produit'));
  await p.goto(BASE + '#checklists'); await p.waitForSelector('#h-checklists');
  await p.waitForFunction(() => JSON.parse(localStorage.getItem('abd-checks') || '{}').d1 === false, null, { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(500);
  const stored = await p.evaluate(() => JSON.parse(localStorage.getItem('abd-checks')));
  ok('LWW: older local tick loses (d1 unticked), newer local tick wins (d2 stays ticked)', stored.d1 === false && stored.d2 === true, JSON.stringify(stored));
  const tickWrite = writes.filter((w) => w.t === 'checklist_ticks').map((w) => JSON.parse(w.body)).flat();
  ok('LWW: only the newer local tick is sent back, with its edit time', tickWrite.length === 1 && tickWrite[0].item_id === 'd2' && tickWrite[0].ticked === true && !!tickWrite[0].client_updated_at, JSON.stringify(tickWrite));
  const profWrite = writes.filter((w) => w.t === 'profiles').map((w) => JSON.parse(w.body));
  ok('LWW: profile writes carry client_updated_at', profWrite.length > 0 && profWrite.every((w) => w.client_updated_at));
  await ctx.close();

  ok('no page errors', errs.length === 0, errs.join(' | '));
  await b.close();
  console.log(`\n${pass} passed, ${fail} failed`);
})();
