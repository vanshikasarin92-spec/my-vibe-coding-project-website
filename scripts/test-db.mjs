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
  grant usage on schema public, auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated;
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

const as = async (role, sub) => {
  await db.exec(
    `reset role; select set_config('request.jwt.claim.sub', '${sub || ''}', false); set role ${role};`,
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

await db.exec('reset role');
ok('events are stored (dashboard view)', (await count('events')) === 1);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
