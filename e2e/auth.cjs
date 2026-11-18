// Browser test for sign-up, log-in, log-out and own-records access.
// Run: npm run build && npm run preview (port 4173), then: node e2e/auth.cjs
// Part 2 hits the live Supabase project with a wrong password (creates nothing).
// Part 3 stands in for Supabase's replies and checks every request is scoped to the user.
const { chromium } = require('playwright');
const BASE = 'http://localhost:4173/';
const UID = '11111111-2222-4333-8444-555555555555';
let pass = 0, fail = 0;
const ok = (n, c, x = '') => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', n, x); };
(async () => {
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
  const errs = [];
  const track = (p) => { p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/400|401|Failed to load resource/.test(m.text())) errs.push(m.text()); }); };

  // 1. Signed out: header link, form, validation (no network needed)
  let ctx = await b.newContext({ ignoreHTTPSErrors: true }); let p = await ctx.newPage(); track(p);
  await p.goto(BASE + '#role'); await p.waitForSelector('#h-role');
  ok('header shows Sign in', (await p.textContent('.acc-link')).trim() === 'Sign in');
  await p.click('.acc-link'); await p.waitForSelector('#h-account');
  ok('account page title', (await p.title()).startsWith('Your account'));
  await p.click('button[type=submit]');
  await p.waitForSelector('.acc-errors');
  ok('empty submit: error summary has focus', await p.waitForFunction(() => document.activeElement.classList.contains('acc-errors'), null, { timeout: 2000 }).then(() => true, () => false));
  ok('empty submit: both fields invalid', (await p.getAttribute('#acc-email', 'aria-invalid')) === 'true' && (await p.getAttribute('#acc-password', 'aria-invalid')) === 'true');
  await p.click('button.toggle:has-text("Sign up")');
  ok('sign-up shows password hint', await p.isVisible('#acc-password-hint'));
  await p.fill('#acc-email', 'someone@example.com'); await p.fill('#acc-password', 'short');
  await p.click('button[type=submit]');
  ok('short password rejected before sending', (await p.textContent('#acc-password-error')).includes('at least 8'));
  ok('new-password autocomplete on sign-up', (await p.getAttribute('#acc-password', 'autocomplete')) === 'new-password');

  // 2. Real log-in failure against the live project
  await p.click('button.toggle:has-text("Log in")');
  await p.fill('#acc-email', 'nobody-' + Date.now() + '@example.com'); await p.fill('#acc-password', 'wrong-password-123');
  await p.click('button[type=submit]');
  await p.waitForSelector('.acc-errors', { timeout: 15000 });
  const live = (await p.textContent('.acc-errors')).replace(/\s+/g, ' ');
  ok('live Supabase rejects a wrong password with a plain message', live.includes("don't match an account"), '| ' + live.slice(0, 90));
  await ctx.close();

  // 3. Signed in (Supabase responses stood in by the test), checking every request is scoped to this user
  ctx = await b.newContext({ ignoreHTTPSErrors: true }); p = await ctx.newPage(); track(p);
  const sent = [];
  const now = Math.floor(Date.now() / 1000);
  await p.route('**/auth/v1/token**', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
    access_token: 'test-token', token_type: 'bearer', expires_in: 3600, expires_at: now + 3600, refresh_token: 'r',
    user: { id: UID, aud: 'authenticated', role: 'authenticated', email: 'pat@example.com', identities: [{ id: '1' }] } }) }));
  await p.route('**/auth/v1/logout**', r => r.fulfill({ status: 204, body: '' }));
  await p.route('**/rest/v1/**', async r => {
    const req = r.request(); const u = new URL(req.url());
    sent.push({ method: req.method(), table: u.pathname.split('/').pop(), query: u.search, body: req.postData() });
    if (req.method() === 'GET') {
      const t = u.pathname.split('/').pop();
      const data = t === 'profiles' ? { role_id: 'po', lang: 'en', library_role_id: 'po' }
        : t === 'action_completions' ? [{ role_id: 'po', kind: 'do', completed_at: '2026-11-01T10:00:00Z' }]
        : [{ item_id: 'd1', ticked: true }];
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
    }
    return r.fulfill({ status: 201, contentType: 'application/json', body: '[]' });
  });
  await p.goto(BASE + '#account'); await p.waitForSelector('#acc-email');
  await p.fill('#acc-email', 'pat@example.com'); await p.fill('#acc-password', 'correct-horse-1');
  await p.click('button[type=submit]');
  await p.waitForSelector('.acc-saved', { timeout: 10000 });
  const summary = (await p.innerText('.acc-saved')).replace(/\s+/g, ' ');
  ok('signed in: summary shows own saved records', summary.includes('Product owner') && /Actions done 1/.test(summary) && /ticked 1/.test(summary), '| ' + summary);
  ok('header switches to Your account', (await p.textContent('.acc-link')).trim() === 'Your account');

  // Your role: account restores the profile on this empty browser
  await p.goto(BASE + '#role'); await p.waitForSelector('#h-role');
  await p.waitForFunction(() => document.querySelector('#h-role').textContent.includes('Product owner'), null, { timeout: 8000 });
  ok('Your role restored from the account', true);
  ok('restored action shows as done (card offers Do this next)', (await p.textContent('#ra-do-h')).includes('Do this next'));
  await p.click('.ra-do .btn.primary'); await p.click('.btn-group .btn.primary'); await p.waitForTimeout(500);
  // Checklists: tick one item
  await p.goto(BASE + '#checklists'); await p.waitForSelector('#h-checklists');
  ok('checklists say ticks are saved to the account', (await p.textContent('#v-checklists .lede')).includes('saved to your account'));
  await p.locator('#v-checklists input[type=checkbox]').nth(1).check(); await p.waitForTimeout(500);

  // Every request: reads filtered by this user's id; writes carry only this user's id
  const reads = sent.filter(s => s.method === 'GET');
  const writes = sent.filter(s => s.method !== 'GET');
  const readsScoped = reads.length > 0 && reads.every(s => s.query.includes((s.table === 'profiles' ? 'id' : 'user_id') + '=eq.' + UID));
  ok('every read is filtered to the signed-in id', readsScoped, `(${reads.length} reads)`);
  const writesScoped = writes.length > 0 && writes.every(s => {
    if (s.method === 'PATCH') return s.query.includes('id=eq.' + UID);
    const rows = [].concat(JSON.parse(s.body || '[]'));
    return rows.length > 0 && rows.every(r => r.user_id === UID);
  });
  ok('every write carries only the signed-in id', writesScoped, `(${writes.length} writes: ${[...new Set(writes.map(w => w.method + ' ' + w.table))].join(', ')})`);
  ok('action done was saved to the account', writes.some(w => w.table === 'action_completions' && /"kind":"next"/.test(w.body || '')));
  ok('checklist tick was saved to the account', writes.some(w => w.table === 'checklist_ticks' && /"ticked":true/.test(w.body || '')));

  // Log out
  await p.goto(BASE + '#account'); await p.waitForSelector('text=Log out'); await p.click('text=Log out');
  await p.waitForSelector('#acc-email');
  ok('log out returns to the form with a notice', (await p.textContent('.acc-notice')).includes('logged out'));
  ok('no page errors', errs.length === 0, errs.join(' | '));
  await b.close();
  console.log(`\n${pass} passed, ${fail} failed`);
})();
