// Browser test: taking the hub into the work.
//   Copy as ticket (Do this now / Do this next), the role's done-checklist, the
//   link back (?role=…&src=…#role), and "What's new" for people not signed in.
// Run: npm run build && npm run preview (port 4173), then: node e2e/workflow.cjs [shots-dir]
const { chromium } = require('playwright');
const BASE = 'http://localhost:4173/';
const SHOTS = process.argv[2];
let pass = 0, fail = 0;
const ok = (n, c, x = '') => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', n, x); };
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
const json = (r, body, status = 200) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

// A news item published after the bundled news, as if the team added it in Supabase.
const LIVE_ITEM = {
  id: 999, published_on: '2026-11-10', date_label: '10 Nov 2026', topic_id: 'standards', tag: 'Standards',
  title: 'Test item: new guidance published in November', body: 'Body.', means_lead: 'What it means:', means: 'Something.',
  sources_label: 'Source', news_sources: [{ position: 1, label: 'Example', url: 'https://example.com' }],
};

(async () => {
  const b = await chromium.launch({ proxy });
  const errs = [];
  const open = async ({ news = 'live', init } = {}) => {
    const ctx = await b.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1280, height: 900 } });
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://localhost:4173' });
    if (init) await ctx.addInitScript(init);
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(e.message));
    await p.route('**/rest/v1/**', (r) => {
      const url = r.request().url();
      if (url.includes('/news_items')) return news === 'fail' ? r.abort('failed') : json(r, [LIVE_ITEM]);
      return json(r, r.request().method() === 'GET' ? [] : null);
    });
    await p.route('**/auth/v1/**', (r) => json(r, {}, 401));
    return { ctx, p };
  };
  const clip = (p) => p.evaluate(() => navigator.clipboard.readText());

  // 1. Pick a role → the role's checklist
  let { ctx, p } = await open();
  await p.goto(BASE + '#role');
  await p.click('button:has-text("Developer")');
  await p.waitForSelector('#ra-dod-h');
  ok('role view: checklist titled for the role', (await p.textContent('#ra-dod-h')) === 'Pull request checklist');
  ok('checklist: 8 items, each with a WCAG reference or test', (await p.$$('.ra-dod-list li')).length === 8);
  ok('checklist items are not drawn as fake checkboxes', (await p.$$eval('.ra-dod-list li', (ls) => getComputedStyle(ls[0], '::before').content)) === 'none');
  await p.click('[data-act="dod"]');
  await p.waitForSelector('.ra-dod .ra-status:has-text("Checklist copied")');
  let text = await clip(p);
  ok('Copy checklist: Markdown heading, 8 checkboxes, link back', text.startsWith('## Pull request checklist') && text.split('\n').filter((l) => l.startsWith('- [ ] ')).length === 8 && text.trim().endsWith('?role=dev&src=checklist#role'), text.split('\n').at(-1));
  if (SHOTS) await p.screenshot({ path: `${SHOTS}/role-checklist.png`, fullPage: true });

  // 2. Do this now → Copy as ticket
  await p.click('.ra-side button:has-text("Set it up")');
  await p.waitForSelector('[data-act="ticket"]');
  await p.click('[data-act="ticket"]');
  await p.waitForSelector('.ra-status:has-text("Ticket text copied")');
  text = await clip(p);
  const lines = text.split('\n');
  ok('ticket: title line names the action', lines[0] === 'Accessibility: Run axe in CI on your repo', lines[0]);
  ok('ticket: why, by when, done-when checkboxes', text.includes('**Why:** ') && text.includes('**By when:** 5 Dec 2027') && lines.filter((l) => l.startsWith('- [ ] ')).length === 4);
  ok('ticket: the Playwright test as a code block', text.includes('```ts\nimport { test, expect }') && text.includes('\n```\n'));
  ok('ticket: link back to the hub on this role', lines.at(-1) === 'Requirements, deadlines and how-to: http://localhost:4173/?role=dev&src=ticket#role', lines.at(-1));
  await p.click('.ra-ticket summary');
  ok('ticket preview shows exactly what is copied', (await p.textContent('.ra-ticket pre')) === text);
  if (SHOTS) await p.screenshot({ path: `${SHOTS}/do-now-ticket.png`, fullPage: true });

  // 3. French
  await p.click('[data-act="lang"]');
  await p.click('[data-act="ticket"]');
  text = await clip(p);
  ok('French ticket: French labels, same link back', text.startsWith('Accessibilité') && text.includes('**Terminé quand:**') && text.includes('?role=dev&src=ticket#role'));
  await p.click('[data-act="lang"]');

  // 4. Do this next → its own ticket, no Do-this-now details
  await p.click('button:has-text("I\'ve added it")');
  await p.click('button:has-text("Back to your view")');
  await p.click('.ra-side button:has-text("Start the test")');
  await p.click('[data-act="ticket"]');
  text = await clip(p);
  ok('Do this next ticket: its title and steps, no details block', text.startsWith('Accessibility: Test one flow with a keyboard and a screen reader') && !text.includes('**Details:**') && text.split('\n').filter((l) => l.startsWith('- [ ] ')).length === 4);
  await ctx.close();

  // 5. Link back from a ticket, for someone with no saved role
  ({ ctx, p } = await open());
  await p.goto(BASE + '?role=qa&src=ticket#role');
  await p.waitForSelector('#ra-dod-h');
  ok('ticket link: opens on the linked role', (await p.textContent('#h-role')) === 'QA analyst' && (await p.textContent('#ra-dod-h')) === 'Test checklist', await p.textContent('#h-role'));
  ok('ticket link: query removed from the address', (await p.evaluate(() => location.search)) === '' && (await p.evaluate(() => location.hash)) === '#role');
  await ctx.close();

  // 6. ...and for someone who already has a role: theirs is kept
  ({ ctx, p } = await open({ init: () => { if (!localStorage.getItem('abd-profile')) localStorage.setItem('abd-profile', JSON.stringify({ role: 'des', lang: 'en', actions: {}, lastVisit: Date.now() })); sessionStorage.setItem('abd-visit', '1'); } }));
  await p.goto(BASE + '?role=qa&src=ticket#role');
  await p.waitForSelector('#h-role');
  ok('ticket link: a saved role is not overwritten', (await p.textContent('#h-role')) === 'Product designer', await p.textContent('#h-role'));
  await ctx.close();

  // 7. What's new, not signed in: last visit 1 Nov, live news has an item from 10 Nov
  const returning = () => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('abd-profile', JSON.stringify({ role: 'dev', lang: 'en', actions: {}, lastVisit: Date.parse('2026-11-01T12:00:00Z') }));
  };
  ({ ctx, p } = await open({ init: returning }));
  await p.goto(BASE + '#role');
  await p.waitForSelector('#ra-ch');
  ok('return visit (signed out): Welcome back screen', (await p.textContent('#v-role .eyebrow')).includes('Welcome back'));
  await p.waitForSelector('.ra-news li', { timeout: 10000 });
  ok("What's new: shows the item published in Supabase after the last visit", (await p.textContent('.ra-news')).includes('Test item: new guidance published in November'));
  ok("What's new: older bundled news is not repeated", (await p.$$('.ra-news li')).length === 1);
  if (SHOTS) await p.screenshot({ path: `${SHOTS}/welcome-back.png`, fullPage: true });
  await ctx.close();

  // 8. ...and when Supabase can't be reached, the bundled news is used, not an error
  ({ ctx, p } = await open({ news: 'fail', init: returning }));
  await p.goto(BASE + '#role');
  await p.waitForSelector('#ra-ch');
  await p.waitForTimeout(1500);
  ok("What's new offline: falls back quietly, says nothing new since the last visit", (await p.textContent('#v-role')).includes('Nothing new for developers since your last visit on 1 Nov') && !(await p.isVisible('.ra-error')));
  await ctx.close();

  // 9. Phone width
  ({ ctx, p } = await open());
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto(BASE + '#role');
  await p.click('button:has-text("Product owner")');
  await p.waitForSelector('#ra-dod-h');
  ok('phone: no sideways scrolling on the role view', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await ctx.close();

  ok('no page errors', errs.length === 0, errs.join(' | '));
  await b.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
