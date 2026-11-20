// Runs the Supabase migrations + seed on real Postgres (PGlite, in-process) with a
// minimal stand-in for Supabase's auth schema and roles, then checks that the
// content matches the app's data files and that row level security holds.
// Run: npm run test:db   (no Supabase account or Docker needed)
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HUB = fileURLToPath(new URL('..', import.meta.url));
const db = new PGlite();
let pass = 0,
  fail = 0;
const ok = (name, cond, extra = '') => {
  cond ? pass++ : fail++;
  console.log(cond ? 'PASS' : 'FAIL', name, extra);
};
const one = async (sql, params) => (await db.query(sql, params)).rows;
const expectError = async (name, sql, re) => {
  try {
    await db.exec(sql);
    ok(name, false, '(no error)');
  } catch (e) {
    ok(name, re.test(e.message), `(${e.message})`);
  }
};

// Supabase stand-in: roles, auth schema, auth.uid() from the JWT claim, default grants.
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create function auth.jwt() returns jsonb language sql stable as
    $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
  grant usage on schema public, auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated;
  grant execute on function auth.jwt() to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`);

const dir = join(HUB, 'supabase/migrations');
for (const f of readdirSync(dir).sort()) {
  await db.exec(readFileSync(join(dir, f), 'utf8'));
  console.log('applied', f);
}
await db.exec(readFileSync(join(HUB, 'supabase/seed.sql'), 'utf8'));
console.log('applied seed.sql');

// Content matches the app's data files.
const roles = await import(join(HUB, 'src/features/your-role/data/roles.js'));
const news = await import(join(HUB, 'src/features/news/data/news.js'));
const lib = await import(join(HUB, 'src/features/resource-library/data/resources.js'));
const ck = await import(join(HUB, 'src/features/checklists/data/checklists.js'));
const count = async (t) => Number((await one(`select count(*)::int as n from public.${t}`))[0].n);
const expected = {
  roles: roles.RA_IDS.length,
  role_criteria: roles.RA_IDS.reduce((n, id) => n + roles.RA_R[id].en.items.length, 0),
  role_actions: roles.RA_IDS.length * 2,
  library_roles: lib.ROLES.length - 1,
  news_items: news.NEWS.length,
  news_sources: news.NEWS.reduce((n, x) => n + x.sources.length, 0),
  topic_roles: Object.values(roles.RA_TOPIC).reduce((n, r) => n + r.length, 0),
  resource_groups: lib.RES.length,
  resources: lib.RES.reduce((n, g) => n + g.items.length, 0),
  resource_roles: lib.RES.reduce((n, g) => n + g.items.reduce((m, it) => m + it[3].length, 0), 0),
  checklists: ck.CHECKLISTS.length,
  checklist_items: ck.CHECKLISTS.reduce((n, c) => n + c.items.length, 0),
  checklist_item_refs: ck.CHECKLISTS.reduce(
    (n, c) => n + c.items.reduce((m, it) => m + it.refs.length, 0),
    0,
  ),
};
for (const [t, n] of Object.entries(expected))
  ok(`rows in ${t}`, (await count(t)) === n, `${await count(t)} / ${n}`);
const dev = (
  await one(
    `select steps_fr, copy_text_en, copy_text_fr from public.role_actions where role_id='dev' and kind='do'`,
  )
)[0];
ok(
  'French steps and copy text round-trip',
  JSON.stringify(dev.steps_fr) === JSON.stringify(roles.RA_R.dev.fr.act.steps) &&
    dev.copy_text_en === roles.RA_COPY.dev.en &&
    dev.copy_text_fr === null,
);

// Two people sign up (as Supabase Auth would). The trigger makes their profiles.
const A = '11111111-1111-1111-1111-111111111111',
  B = '22222222-2222-2222-2222-222222222222';
await db.exec(`insert into auth.users (id) values ('${A}'), ('${B}')`);
ok('signup trigger creates a profile', (await count('profiles')) === 2);

const EMAIL = {};
const as = async (role, sub) => {
  const claims = sub ? JSON.stringify({ sub, email: EMAIL[sub] || '' }) : '{}';
  await db.exec(
    `reset role; select set_config('request.jwt.claim.sub', '${sub || ''}', false); select set_config('request.jwt.claims', '${claims}', false); set role ${role};`,
  );
};

// Anonymous visitor.
await as('anon');
ok('anon reads content', (await count('roles')) === 6);
ok('anon sees no profiles', (await count('profiles')) === 0);
ok(
  'anon update of a profile changes 0 rows',
  (await db.query(`update public.profiles set role_id = 'dev' where id = '${A}'`)).affectedRows ===
    0,
);
await db.exec(
  `insert into public.events (session_id, name, role_id, lang) values (gen_random_uuid(), 'screen_view', null, 'en')`,
);
ok('anon can send an event', true);
ok('anon cannot read events', (await count('events')) === 0);
await expectError(
  'anon cannot call start_visit',
  `select public.start_visit()`,
  /permission denied/,
);
await expectError(
  'anon cannot write content',
  `insert into public.news_topics (id, label, sort_order) values ('x', 'x', 9)`,
  /row-level security|permission denied/,
);

// Person A.
await as('authenticated', A);
await db.exec(
  `update public.profiles set role_id = 'dev', lang = 'fr', last_visit_at = '2026-08-01T12:00:00Z'`,
);
const visit = (await one(`select prev_visit_at, last_visit_at from public.start_visit()`))[0];
ok(
  'start_visit moves last visit to previous visit',
  new Date(visit.prev_visit_at).toISOString().startsWith('2026-08-01'),
);
const wn = (await one(`select title from public.whats_new()`)).map((r) => r.title).sort();
const { whatsNewFor } = await import(join(HUB, 'src/features/your-role/logic/whatsNew.js'));
const js = whatsNewFor(news.NEWS, roles.RA_TOPIC, 'dev', Date.parse('2026-08-01T12:00:00Z'))
  .map((n) => n.title)
  .sort();
ok(
  "whats_new() matches the app's What's new logic",
  JSON.stringify(wn) === JSON.stringify(js),
  `${wn.length} items`,
);
await db.exec(
  `insert into public.action_completions (user_id, role_id, kind) values ('${A}', 'dev', 'do')`,
);
await db.exec(`insert into public.checklist_ticks (user_id, item_id) values ('${A}', 'd1')`);
ok('A sees only own profile', (await count('profiles')) === 1);
await expectError(
  "A cannot write B's completion",
  `insert into public.action_completions (user_id, role_id, kind) values ('${B}', 'dev', 'do')`,
  /row-level security/,
);
await db.exec(`update public.profiles set role_id = 'qa' where id = '${B}'`);
await expectError(
  'bad language rejected',
  `update public.profiles set lang = 'de'`,
  /check constraint/,
);
await expectError(
  'unknown event name rejected',
  `insert into public.events (session_id, name) values (gen_random_uuid(), 'hack')`,
  /check constraint/,
);

// Last-write-wins (A is still signed in here).
await db.exec(`update public.profiles set lang = 'en', client_updated_at = '2026-11-17T10:00:00Z'`);
await db.exec(`update public.profiles set lang = 'fr', client_updated_at = '2026-11-17T09:00:00Z'`);
ok('LWW: an older edit arriving later is ignored', (await one(`select lang from public.profiles`))[0].lang === 'en');
await db.exec(`update public.profiles set lang = 'fr', client_updated_at = '2026-11-17T11:00:00Z'`);
ok('LWW: a newer edit wins', (await one(`select lang from public.profiles`))[0].lang === 'fr');
const beforeVisit = (await one(`select last_visit_at from public.profiles`))[0].last_visit_at;
await db.exec(`select public.start_visit()`);
ok('LWW: start_visit() still updates visit dates', String((await one(`select prev_visit_at from public.profiles`))[0].prev_visit_at) === String(beforeVisit));
await db.exec(`insert into public.checklist_ticks (user_id, item_id, ticked, client_updated_at) values ('${A}', 'd2', true, '2026-11-17T10:00:00Z')
  on conflict (user_id, item_id) do update set ticked = excluded.ticked, client_updated_at = excluded.client_updated_at`);
await db.exec(`insert into public.checklist_ticks (user_id, item_id, ticked, client_updated_at) values ('${A}', 'd2', false, '2026-11-17T09:59:00Z')
  on conflict (user_id, item_id) do update set ticked = excluded.ticked, client_updated_at = excluded.client_updated_at`);
ok('LWW: stale upsert of a tick is ignored', (await one(`select ticked from public.checklist_ticks where item_id = 'd2'`))[0].ticked === true);
await db.exec(`update public.checklist_ticks set ticked = false, client_updated_at = now() + interval '10 days' where item_id = 'd2'`);
const capped = (await one(`select client_updated_at < now() + interval '6 minutes' as ok from public.checklist_ticks where item_id = 'd2'`))[0].ok;
ok('LWW: a clock far in the future is capped', capped === true);
await db.exec(`insert into public.checklist_ticks (user_id, item_id, client_updated_at) values ('${A}', 'd3', now() + interval '10 days')`);
ok('LWW: future clock capped on first insert too', (await one(`select client_updated_at < now() + interval '6 minutes' as ok from public.checklist_ticks where item_id = 'd3'`))[0].ok === true);

// Person B can't see A's data, and A's update to B changed nothing.
await as('authenticated', B);
ok('B sees no completions of A', (await count('action_completions')) === 0);
ok('B sees no ticks of A', (await count('checklist_ticks')) === 0);
ok(
  "A's update to B's profile had no effect",
  (await one(`select role_id from public.profiles`))[0].role_id === null,
);
ok(
  "B has no What's new before a second visit",
  (await one(`select * from public.whats_new()`)).length === 0,
);

// Invites
const C = '33333333-3333-3333-3333-333333333333';
EMAIL[A] = 'a@example.com';
EMAIL[B] = 'b@example.com';
EMAIL[C] = 'c@example.com';
await as('authenticated', A);
await db.exec(`insert into public.invites (recipient_email, sender_email, status) values ('  C@Example.com ', 'fake@evil.test', 'accepted')`);
const inv = (await one(`select sender_id, sender_email, recipient_email, status from public.invites`))[0];
ok('invite: sender, email and status set by the database, not the client', inv.sender_id === A && inv.sender_email === 'a@example.com' && inv.recipient_email === 'c@example.com' && inv.status === 'pending', JSON.stringify(inv));
await expectError('invite: cannot invite yourself', `insert into public.invites (recipient_email) values ('a@example.com')`, /cannot invite yourself/);
await expectError('invite: one open invite per recipient', `insert into public.invites (recipient_email) values ('c@example.com')`, /unique|duplicate/);
await expectError('invite: recipient must be an email', `insert into public.invites (recipient_email) values ('not-an-email')`, /check constraint/);
ok('invite: direct status update changes nothing (no update policy)', (await db.query(`update public.invites set status = 'accepted'`)).affectedRows === 0);
let m = (await one(`select * from public.invite_metrics()`))[0];
ok('metrics: 1 sent, 1 pending, 0% accepted, mine counted', Number(m.sent) === 1 && Number(m.pending) === 1 && Number(m.acceptance_rate) === 0 && Number(m.my_sent) === 1, JSON.stringify(m));
await as('authenticated', B);
ok("invite: B (not sender or recipient) sees none", (await count('invites')) === 0);
ok("invite: B cannot cancel A's invite", (await one(`select public.cancel_invite(id) as ok from (select 1 as id) x`))[0].ok === false);
await db.exec('reset role');
await db.exec(`insert into auth.users (id) values ('${C}')`);
await as('authenticated', C);
ok('invite: recipient sees the invite addressed to them', (await count('invites')) === 1);
ok('invite: recipient signing in accepts it', (await one(`select public.accept_my_invites() as n`))[0].n === 1);
m = (await one(`select * from public.invite_metrics()`))[0];
ok('metrics: accepted 1, acceptance 100%, my_sent 0 for C', Number(m.accepted) === 1 && Number(m.acceptance_rate) === 100 && Number(m.my_sent) === 0, JSON.stringify(m));
await as('authenticated', A);
ok('invite: an accepted invite cannot be cancelled', (await one(`select public.cancel_invite(id) as ok from public.invites where recipient_email = 'c@example.com'`))[0].ok === false);
await db.exec(`insert into public.invites (recipient_email) values ('d@example.com')`);
ok('invite: sender cancels a pending invite', (await one(`select public.cancel_invite(id) as ok from public.invites where recipient_email = 'd@example.com'`))[0].ok === true);
await db.exec(`insert into public.invites (recipient_email) values ('d@example.com')`);
ok('invite: can invite again after cancelling', (await count('invites')) === 3);
m = (await one(`select * from public.invite_metrics()`))[0];
ok('metrics: cancelled excluded from the acceptance rate (1 of 2 = 50%)', Number(m.cancelled) === 1 && Number(m.acceptance_rate) === 50, JSON.stringify(m));
await as('anon');
ok('invite: anon sees no invites', (await count('invites')) === 0);
await expectError('invite: anon cannot read metrics', `select * from public.invite_metrics()`, /permission denied/);
await expectError('invite: anon cannot send', `insert into public.invites (recipient_email) values ('e@example.com')`, /row-level security|permission denied|Sign in/);

await db.exec('reset role');
ok('events are stored (dashboard view)', (await count('events')) === 1);
// Analytics: anonymous page views -----------------------------------------------
const V1 = 'aaaaaaaa-0000-4000-8000-000000000001', V2 = 'aaaaaaaa-0000-4000-8000-000000000002';
const S1 = 'bbbbbbbb-0000-4000-8000-000000000001', S2 = 'bbbbbbbb-0000-4000-8000-000000000002';
const P = (n) => `cccccccc-0000-4000-8000-00000000000${n}`;
await as('anon');
await db.exec(`insert into public.page_views (id, visitor_id, session_id, page, started_at, duration_ms) values
  ('${P(1)}', '${V1}', '${S1}', 'role', now() - interval '300 days', 999999),
  ('${P(2)}', '${V1}', '${S1}', 'news', now(), null),
  ('${P(3)}', '${V2}', '${S2}', 'role', now(), null)`);
ok('page views: anon can record views but cannot read them', (await count('page_views')) === 0);
await expectError('page views: page name must be a route id', `insert into public.page_views (id, visitor_id, session_id, page) values ('${P(4)}', '${V1}', '${S1}', '<script>')`, /check constraint/);
await db.exec(`select public.end_page_view('${P(1)}', '${V1}', 60000), public.end_page_view('${P(2)}', '${V1}', 30000), public.end_page_view('${P(3)}', '${V2}', 5000)`);
await db.exec(`select public.end_page_view('${P(1)}', '${V2}', 1700000)`); // wrong visitor
await db.exec(`select public.end_page_view('${P(2)}', '${V1}', 10000)`); // smaller: ignored
await expectError('analytics: anon cannot read totals', `select public.site_analytics(30)`, /permission denied/);
await db.exec('reset role');
const rows = await one(`select id, started_at > now() - interval '1 minute' as fresh, duration_ms from public.page_views order by id`);
ok('page views: server sets the time, ignoring what the browser sent', rows.every((r) => r.fresh), JSON.stringify(rows));
ok('page views: time on page recorded; wrong visitor and smaller values ignored', rows.map((r) => r.duration_ms).join() === '60000,30000,5000', rows.map((r) => r.duration_ms).join());
await db.exec(`select public.end_page_view('${P(3)}', '${V2}', 99999999)`);
ok('page views: time on page capped at 30 minutes', (await one(`select duration_ms from public.page_views where id = '${P(3)}'`))[0].duration_ms === 1800000);
await db.exec(`update public.page_views set duration_ms = 5000 where id = '${P(3)}'`);
await db.exec(`insert into public.page_views (id, visitor_id, session_id, page) values ('${P(5)}', '${V2}', '${S2}', 'role')`);
await db.exec(`update public.page_views set started_at = now() - interval '35 days', session_id = '${S1}' where id = '${P(5)}'`); // previous period
await as('authenticated', A);
const an = (await one(`select public.site_analytics(30) as j`))[0].j;
const c = an.current, pr = an.previous;
ok('analytics: visitors 2, page views 3, visits 2', c.visitors === 2 && c.page_views === 3 && c.visits === 2, JSON.stringify(c));
ok('analytics: views per visit 1.5, avg visit 47.5s, bounce 50%', Number(c.views_per_visit) === 1.5 && Number(c.avg_visit_ms) === 47500 && Number(c.bounce_rate) === 50, JSON.stringify(c));
ok('analytics: previous period counted separately', pr.visitors === 1 && pr.page_views === 1 && Number(pr.bounce_rate) === 100, JSON.stringify(pr));
ok('analytics: 30-day series ending today holds the 3 views', an.series.length === 30 && an.series.at(-1).page_views === 3 && an.series.reduce((t, d) => t + d.page_views, 0) === 3);
ok('analytics: top pages, most viewed first', an.pages[0].page === 'role' && an.pages[0].page_views === 2 && an.pages[0].visitors === 2, JSON.stringify(an.pages));
const empty = (await one(`select public.site_analytics(1) as j`))[0].j;
ok('analytics: range is clamped and no row details leak', Object.keys(an).sort().join() === 'as_of,current,days,pages,previous,series' && empty.days === 1);
await db.exec('reset role');
await db.exec('delete from public.page_views');
await as('authenticated', A);
const none = (await one(`select public.site_analytics(7) as j`))[0].j.current;
ok('analytics: no data gives zeros and empty rates, not errors', none.visitors === 0 && none.page_views === 0 && none.visits === 0 && none.views_per_visit === null && none.bounce_rate === null, JSON.stringify(none));
await db.exec('reset role');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
