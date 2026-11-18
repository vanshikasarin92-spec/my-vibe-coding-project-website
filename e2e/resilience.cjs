// Browser test: no request can freeze the UI, and rapid clicks don't duplicate.
// Supabase's replies are stood in for, including replies that never come.
// Run: npm run build && npm run preview (port 4173), then: node e2e/resilience.cjs
const { chromium } = require('playwright');
const BASE = 'http://localhost:4173/';
const UID = '11111111-2222-4333-8444-555555555555';
const REF = 'hclfejkgjdidbxaevtcp';
let pass = 0, fail = 0;
const ok = (n, c, x = '') => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', n, x); };
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
const json = (r, body, status = 200) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
const now = () => Math.floor(Date.now() / 1000);
const USER = { id: UID, aud: 'authenticated', role: 'authenticated', email: 'pat@example.com', identities: [{ id: '1' }] };
const hang = () => {}; // a route handler that never answers

(async () => {
  const b = await chromium.launch({ proxy });
  const errs = [];
  const fresh = async () => {
    const ctx = await b.newContext({ ignoreHTTPSErrors: true });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(e.message));
    return { ctx, p };
  };

  // A signed-in person with an in-memory invites table. Returns the request log.
  const signedIn = async (p) => {
    const log = [];
    const invites = [];
    await p.route('**/auth/v1/**', (r) => json(r, { access_token: 't', token_type: 'bearer', expires_in: 3600, expires_at: now() + 3600, refresh_token: 'r', user: USER }));
    await p.route('**/rest/v1/**', async (r) => {
      const req = r.request();
      const path = new URL(req.url()).pathname;
      log.push(req.method() + ' ' + path);
      if (path.endsWith('/rpc/invite_metrics')) return json(r, [{ sent: invites.length, accepted: 0, pending: invites.filter((i) => i.status === 'pending').length, cancelled: 0, acceptance_rate: null, sent_last_7_days: invites.length, accepted_last_7_days: 0, my_sent: invites.length, my_accepted: 0, as_of: new Date().toISOString() }]);
      if (path.endsWith('/rpc/cancel_invite')) {
        await new Promise((res) => setTimeout(res, 400));
        const id = JSON.parse(req.postData()).invite_id;
        const inv = invites.find((i) => i.id === id && i.status === 'pending');
        if (inv) inv.status = 'cancelled';
        return json(r, !!inv);
      }
      if (path.includes('/rpc/')) return json(r, null);
      if (path.endsWith('/invites') && req.method() === 'POST') {
        await new Promise((res) => setTimeout(res, 400)); // a realistic round trip
        const email = JSON.parse(req.postData()).recipient_email;
        if (invites.some((i) => i.recipient_email === email && i.status !== 'cancelled')) return json(r, { code: '23505', message: 'duplicate key value violates unique constraint' }, 409);
        invites.push({ id: invites.length + 1, recipient_email: email, status: 'pending', created_at: new Date().toISOString(), responded_at: null });
        return json(r, null, 201);
      }
      if (path.endsWith('/invites')) return json(r, invites);
      if (path.endsWith('/profiles')) return json(r, null);
      if (req.method() !== 'GET') return json(r, [], 201);
      return json(r, []);
    });
    await p.goto(BASE + '#account');
    await p.waitForSelector('#acc-email');
    await p.fill('#acc-email', 'pat@example.com');
    await p.fill('#acc-password', 'correct-horse-1');
    await p.click('button[type=submit]');
    await p.waitForSelector('text=Signed in as', { timeout: 10000 });
    return { log, invites };
  };

  // 1. Sign-in request that never answers
  let { ctx, p } = await fresh();
  await p.route('**/auth/v1/token**', hang);
  await p.goto(BASE + '#account'); await p.waitForSelector('#acc-email');
  await p.fill('#acc-email', 'pat@example.com'); await p.fill('#acc-password', 'correct-horse-1');
  let t0 = Date.now();
  await p.click('button[type=submit]');
  await p.waitForSelector('.acc-errors button:has-text("Retry")', { timeout: 12000 });
  ok('hung log-in: inline error with Retry within ~8s', true, `(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  ok('hung log-in: submit button is usable again', !(await p.isDisabled('button[type=submit]')));
  await p.unroute('**/auth/v1/token**');
  await p.route('**/auth/v1/**', (r) => json(r, { access_token: 't', token_type: 'bearer', expires_in: 3600, expires_at: now() + 3600, refresh_token: 'r', user: USER }));
  await p.route('**/rest/v1/**', (r) => json(r, r.request().method() === 'GET' ? [] : null));
  await p.click('.acc-errors button:has-text("Retry")');
  await p.waitForSelector('text=Signed in as', { timeout: 10000 });
  ok('Retry signs in once the network is back', true);
  await ctx.close();

  // 2. Saved session needs refreshing and the network never answers
  ({ ctx, p } = await fresh());
  await p.addInitScript(([ref, user]) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem(`sb-${ref}-auth-token`, JSON.stringify({ access_token: 'old', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) - 60, refresh_token: 'r', user }));
  }, [REF, USER]);
  await p.route('**/auth/v1/token**', hang);
  t0 = Date.now();
  await p.goto(BASE + '#invites');
  await p.waitForSelector('.state-error button:has-text("Retry")', { timeout: 12000 });
  ok('hung sign-in check: Invites shows an inline error with Retry, not endless loading', true, `(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  ok('error says what happened', (await p.textContent('.state-error')).includes("couldn't check whether you're signed in"));
  await ctx.close();

  // 3. Sending an invite that never answers, then Retry
  ({ ctx, p } = await fresh());
  let s = await signedIn(p);
  await p.goto(BASE + '#invites'); await p.waitForSelector('#inv-email');
  await p.route('**/rest/v1/invites', (r) => (r.request().method() === 'POST' ? hang() : r.fallback()));
  await p.fill('#inv-email', 'sam@example.com');
  t0 = Date.now();
  await p.click('button:has-text("Send invite")');
  ok('while sending: button says Sending… and is disabled', (await p.textContent('form button[type=submit]')) === 'Sending…' && (await p.isDisabled('form button[type=submit]')));
  await p.waitForSelector('#inv-email-error', { timeout: 12000 });
  ok('hung send: inline error with Retry within ~8s', (await p.isVisible('.acc-field button:has-text("Retry")')), `(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  ok('hung send: Send button no longer stuck', (await p.textContent('form button[type=submit]')) === 'Send invite' && !(await p.isDisabled('form button[type=submit]')));
  ok('the address is kept for Retry', (await p.inputValue('#inv-email')) === 'sam@example.com');
  await p.unroute('**/rest/v1/invites');
  await p.click('.acc-field button:has-text("Retry")');
  await p.waitForSelector('.inv-table th[scope=row]:has-text("sam@example.com")', { timeout: 10000 });
  ok('Retry sends it once the network is back', s.invites.length === 1);

  // 3b. Slow reply: the invite IS saved, but the answer comes after the hub
  // stopped waiting (DevTools "Hang" profile). Retry must say saved, not duplicate.
  await p.route('**/rest/v1/invites', async (r) => {
    if (r.request().method() !== 'POST') return r.fallback();
    const email = JSON.parse(r.request().postData()).recipient_email;
    s.invites.push({ id: s.invites.length + 1, recipient_email: email, status: 'pending', created_at: new Date().toISOString(), responded_at: null });
    await new Promise((res) => setTimeout(res, 20000));
    r.fulfill({ status: 201, contentType: 'application/json', body: 'null' }).catch(() => {});
  });
  await p.fill('#inv-email', 'slow@example.com');
  await p.click('button:has-text("Send invite")');
  await p.waitForSelector('.acc-field button:has-text("Retry")', { timeout: 12000 });
  ok('slow reply: shows the network error with Retry first', true);
  await p.unroute('**/rest/v1/invites');
  await p.click('.acc-field button:has-text("Retry")');
  await p.waitForSelector('.acc-notice:has-text("first try got through")', { timeout: 10000 }).catch(() => {});
  ok('slow reply: Retry says the invite was saved, not "already invited"', (await p.textContent('.acc-notice')).includes('first try got through') && !(await p.isVisible('#inv-email-error')), await p.textContent('.acc-notice'));
  ok('slow reply: still one invite', s.invites.filter((i) => i.recipient_email === 'slow@example.com').length === 1);

  // 4. Spam Click: Send invite clicked 5 times fast
  await p.fill('#inv-email', 'lee@example.com');
  const before = s.log.filter((l) => l === 'POST /rest/v1/invites').length;
  await p.evaluate(() => { const btn = document.querySelector('form button[type=submit]'); for (let i = 0; i < 5; i++) btn.click(); });
  await p.waitForSelector('.inv-table th[scope=row]:has-text("lee@example.com")', { timeout: 10000 });
  const posts = s.log.filter((l) => l === 'POST /rest/v1/invites').length - before;
  ok('Spam Click (5× in one tick): one request sent, one invite', posts === 1 && s.invites.filter((i) => i.recipient_email === 'lee@example.com').length === 1, `(requests: ${posts})`);
  await p.fill('#inv-email', 'kim@example.com');
  for (let i = 0; i < 5; i++) await p.click('form button[type=submit]', { force: true, noWaitAfter: true }).catch(() => {});
  await p.waitForSelector('.inv-table th[scope=row]:has-text("kim@example.com")', { timeout: 10000 });
  await p.waitForTimeout(800);
  ok('Spam Click (5 real clicks): one invite', s.invites.filter((i) => i.recipient_email === 'kim@example.com').length === 1);
  ok('no error shown after spam clicks', !(await p.isVisible('#inv-email-error')));

  // 5. Double-click Cancel
  const cancelBefore = s.log.filter((l) => l.endsWith('/rpc/cancel_invite')).length;
  await p.dblclick('button[aria-label*="kim@example.com"]');
  await p.waitForSelector('.ra-status:has-text("cancelled")', { timeout: 10000 }).catch(() => {});
  const cancels = s.log.filter((l) => l.endsWith('/rpc/cancel_invite')).length - cancelBefore;
  ok('double-click Cancel: one request, success message (no false "Couldn\'t cancel")', cancels === 1 && !(await p.textContent('#v-invites')).includes("Couldn't cancel"), `(requests: ${cancels})`);

  // 6. Cancel that never answers, then Retry
  await p.route('**/rest/v1/rpc/cancel_invite', hang);
  await p.click('button[aria-label*="lee@example.com"]');
  await p.waitForSelector('.state-error:has-text("cancel the invite for lee@example.com")', { timeout: 12000 });
  ok('hung cancel: inline error with Retry', await p.isVisible('.state-error button:has-text("Retry")'));
  await p.unroute('**/rest/v1/rpc/cancel_invite');
  await p.click('.state-error button:has-text("Retry")');
  await p.waitForSelector('.ra-status:has-text("lee@example.com")', { timeout: 10000 });
  ok('Retry cancels once the network is back', s.invites.find((i) => i.recipient_email === 'lee@example.com').status === 'cancelled');

  // 7. Checklist save that never answers, then Retry
  await p.route('**/rest/v1/checklist_ticks**', (r) => (r.request().method() === 'POST' ? hang() : r.fallback()));
  await p.goto(BASE + '#checklists'); await p.waitForSelector('#h-checklists');
  await p.click('.state-empty button:has-text("Get started")');
  await p.keyboard.press('Space');
  await p.waitForSelector('.state-error', { timeout: 12000 });
  ok('hung save: inline error with Retry, tick kept', (await p.isVisible('.state-error button:has-text("Retry")')) && (await p.evaluate(() => Object.values(JSON.parse(localStorage.getItem('abd-checks') || '{}')).includes(true))));
  await p.unroute('**/rest/v1/checklist_ticks**');
  await p.click('.state-error button:has-text("Retry")');
  await p.waitForSelector('.state-error', { state: 'detached', timeout: 10000 });
  ok('Retry saves and the error goes away', s.log.some((l) => l === 'POST /rest/v1/checklist_ticks'));
  await ctx.close();

  ok('no page errors', errs.length === 0, errs.join(' | '));
  await b.close();
  console.log(`\n${pass} passed, ${fail} failed`);
})();
