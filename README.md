# Accessible by Default (React)

The Digital Accessibility Hub for Design & Engineering, restructured as a Vite + React app with one file per section.

## Run it

```bash
npm install
npm run dev      # local development
npm run build    # static site in dist/
npm run preview  # serve the built site
npm test         # unit tests for every logic/ folder
npm run test:db  # database migrations, seed and row level security on in-process Postgres
npm run db:seed  # regenerate supabase/seed.sql from the data files
npm run e2e:auth # browser test for accounts (with npm run preview running)
npm run e2e:states # browser test for loading/error/empty states, pagination, last-write-wins
npm run e2e:resilience # hung requests end in an inline error with Retry; rapid clicks don't duplicate
npm run e2e:analytics # Analytics page: tiles, chart hover/keyboard, table, empty/error states
npm run build:artifact # build for a claude.ai artifact (Supabase off)
```

## Structure

Files are grouped by feature. Inside each feature, data, logic, state and display are kept apart, and each layer only imports from the layers below it.

| Layer | Folder (in every feature, and in `shared`) | Holds | Never contains |
| --- | --- | --- | --- |
| Data | `data/` | Content: text, tables, lists, links, dates | Imports, React, logic |
| Logic | `logic/` | Rules as pure functions, with `*.test.js` beside them | React, storage, the DOM |
| State | `hooks/`, `shared/lib/` | React state, browser storage, clipboard | Markup |
| Display | `screens/`, `components/`, the feature's page file | JSX and event wiring | Storage, date maths, filtering |

### Screens from the Living PRD

| PRD screen or requirement | Component |
| --- | --- |
| Role picker (R1) | `features/your-role/screens/RolePicker.jsx` |
| Role view, criteria and deadlines (R3, R4) | `features/your-role/screens/RoleView.jsx` |
| "Do this now" (R5) | `features/your-role/screens/DoThisNow.jsx` |
| "Do this next" (R6) | `features/your-role/screens/DoThisNext.jsx` |
| Return visit, "Welcome back" (R7) | `features/your-role/screens/WelcomeBack.jsx` |
| What's new for the role, empty and error states (R8, R9) | `features/your-role/components/WhatsNew.jsx` |
| English / French switch (R10) | `features/your-role/components/LanguageSwitch.jsx` |
| Resource library opened on the role (R13) | `features/resource-library/ResourceLibrary.jsx` |
| Not named in the PRD: confirmation after an action | `features/your-role/screens/ActionDone.jsx` |

`ActionCard.jsx` (the "Do this now / Do this next" card on Role view and Welcome back) and `ActionSteps.jsx` (the layout both action screens share) are parts of screens, not screens.

```
src/
├── main.jsx · App.jsx            Entry point; App picks the feature page for the URL hash
├── features/
│   ├── your-role/                Default route (#role)
│   │   ├── YourRole.jsx          Chooses the screen and wires it up
│   │   ├── screens/              RolePicker · RoleView · DoThisNow · DoThisNext · ActionDone · WelcomeBack
│   │   ├── components/           ActionCard · ActionSteps · WhatsNew · LanguageSwitch
│   │   ├── data/                 roles.js (EN/FR content) · deadlines.js
│   │   ├── logic/                profile.js · whatsNew.js · yourRole.test.js
│   │   └── hooks/                useProfile.js · useWhatsNew.js
│   ├── overview/                 Overview.jsx · data/
│   ├── news/                     News.jsx · data/ · logic/ (filter + test)
│   ├── standards/                Standards.jsx · data/
│   ├── platforms/                Platforms.jsx · components/PlatformPanel.jsx · data/ · hooks/
│   ├── checklists/               Checklists.jsx · data/ · logic/ (progress + test) · hooks/
│   ├── testing/ · research/ · trends/     page file · data/
│   └── resource-library/         ResourceLibrary.jsx · data/ · logic/ (filters + test) · hooks/
└── shared/
    ├── components/               Layout · Footer · RichText (inline markup in data strings)
    ├── data/                     routes.js (side menu) · site.js (header, footer, swatches)
    ├── logic/                    dates.js · navigation.js · shared.test.js
    ├── hooks/                    useStored.js · useHashRoute.js
    ├── lib/                      storage.js · clipboard.js
    └── styles/                   tokens.css (Mercury) · app.css
```

One cross-feature link: Your role's What's new reads `features/news/data/news.js`, so a news item appears in both places. Page headings and the one-line intro under each heading stay in the page files; every repeated item lives in `data/`.

## How a few things work

- **Your role** remembers the role, language, completed actions and visit dates in the browser (`abd-profile`). A new browser session moves the last visit into `prevVisit`, which opens the "Welcome back" screen.
- **What's new for your role** lists news items dated after the last visit whose topic matches the role (`RA_TOPIC` in `features/your-role/data/roles.js`, rule in `features/your-role/logic/whatsNew.js`). Empty and error states follow the agreed copy.
- **Updating content** means editing the `data/` files in each feature (and the static pages for longer prose). Dates such as "Updated 3 Nov 2026" are in `shared/data/site.js`.

## Supabase backend

`supabase/` holds the database for when the hub moves off static files. The app uses it for accounts and each person's saved progress (see Accounts). Content still comes from `src/features/*/data`.

| File | What it does |
| --- | --- |
| `supabase/migrations/20261112000100_content.sql` | 15 content tables: roles, criteria, Do this now / Do this next actions, deadlines, news (topics, items, sources, topic-to-role map), resource library (roles, groups, resources, resource roles), checklists (lists, items, references). English and French as `_en` / `_fr` columns. Readable by everyone; no app writes. |
| `supabase/migrations/20261112000200_user_data.sql` | `profiles` (one per Supabase Auth user, made by a sign-up trigger), `action_completions`, `visits`, `checklist_ticks`, and `events` (insert-only, no user id). Row level security: people read and change only their own rows. Functions `start_visit()` and `whats_new()` mirror the app's return-visit logic. |
| `supabase/seed.sql` | The current content, generated from the data files by `npm run db:seed`. Don't edit by hand. |
| `scripts/test-db.mjs` | `npm run test:db`: runs the migrations and seed on in-process Postgres (PGlite) and checks row counts against the data files, the sign-up trigger, `whats_new()` against the app's logic, and row level security for anonymous and two signed-in people. 33 checks. |

What maps to what:

| Prototype (browser) | Supabase |
| --- | --- |
| `abd-profile` role, lang, visit dates | `profiles` + `visits`; call `start_visit()` once per session |
| `abd-profile` actions done | `action_completions` |
| `abd-role` (library filter), `abd-tab` | `profiles.library_role_id`, `profiles.platform_tab` |
| `abd-checks` | `checklist_ticks` |
| What's new (`logic/whatsNew.js`) | `whats_new()` |
| Prototype moderator log events | `events` |

To apply to a Supabase project with the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
npx supabase init            # once, adds supabase/config.toml (keep the existing migrations)
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push         # runs supabase/migrations
psql "$SUPABASE_DB_URL" -f supabase/seed.sql   # or paste seed.sql into the SQL editor
```

Not included: the overview, standards, platforms, testing, research and trends pages stay in code (they change rarely and have no per-person data), and no sign-in UI or Supabase client in the app yet.

## Accounts (Supabase Auth)

Signing in is optional. Without an account everything works as before and is saved in the browser. With one, the role, language, completed actions and checklist ticks are saved to the person's own rows in Supabase and follow them to other devices.

- **Where:** `#account` (header link "Sign in" / "Your account"). Email and password: sign up, log in, log out.
- **Code:** `features/account/` (page, form, rules in `logic/credentials.js`), `shared/hooks/useAuth.jsx` (session), `shared/lib/userData.js` (reads and writes own rows), `shared/logic/syncProgress.js` (merging browser and account on sign-in).
- **Own records only, twice over:** row level security in the database (`auth.uid() = user_id`; `= id` on `profiles`) refuses every other person's rows, even through the API; and every query in `userData.js` also filters on the signed-in id.
- **Config:** `.env` holds `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (safe in the browser). Never add the service role key. Without these values the app runs signed-out.
- **Supabase dashboard settings to set before real use:** Authentication → URL configuration: set the Site URL to where the hub is hosted and add it to Redirect URLs, or confirmation emails link to `localhost:3000`. Supabase's built-in email sender allows only a few emails an hour; add custom SMTP for real use.
- **Tests:** `npm test` (includes credential and merge rules), `npm run test:db` (RLS), `npm run e2e:auth` (browser; needs `npm run preview` running).

## Loading, empty and error states; pagination; simultaneous edits

- **News and Resource library** load from Supabase (`shared/lib/content.js`, `features/*/hooks/use*Data.js`). Each shows a skeleton while loading, an inline error with **Retry** if the load fails or takes over 8 seconds (`shared/hooks/useRemote.js`), and an empty state with a **Get started** button. Without Supabase configured they use the bundled copy in `data/`.
- **Get started** empty states also on Checklists (nothing ticked: focuses the first item) and Your account (nothing saved: goes to Your role).
- **Pagination:** News 5 per page, Resource library 10 per page with group headings kept. Changing page moves focus to the page heading. Rules in `shared/logic/paginate.js`; components in `shared/components/StateViews.jsx`.
- **Last-write-wins:** role, language and checklist ticks record when the person changed them. On sign-in and whenever the tab regains focus, the app merges with the account and the later edit wins, item by item (`shared/logic/syncProgress.js`). The database enforces the same rule: an update carrying an older `client_updated_at` is ignored (migration `20261117000300_last_write_wins.sql`). Completed actions are only ever added, so both sides are kept.
- **Tests:** `npm run e2e:states` (31 browser checks, with `npm run preview` running).
- **No frozen screens:** every network call goes through `src/shared/lib/request.js`. A request that hasn't answered in 8 seconds is aborted and shows an inline error with Retry: reads, sign-in, the saved-session check, sending and cancelling invites, and saving progress. Submit and Cancel buttons take one click at a time. `npm run e2e:resilience` checks all of this (19 checks).

## The claude.ai artifact build

Artifact pages can't make network requests to outside services, so `npm run build:artifact` builds with Supabase switched off (`.env.artifact`): the site runs on its bundled content, keeps progress in the browser, and hides Sign in. Accounts and live content need the regular build (`npm run build`) on a real web address.

## Invites and the invites dashboard

- **Page:** `#invites` (side menu "Invites"), signed-in people only. Invite a colleague by email, see your invites with their status, and cancel pending ones. The hub doesn't send email: after saving an invite it gives you a message to copy and send yourself.
- **Table:** `invites` (`sender_email`, `recipient_email`, `status` pending / accepted / cancelled, `created_at` as the timestamp, plus `sender_id` and `responded_at`), migration `20261117000400_invites.sql`. The database sets the sender, their email, the status and the time on insert, so the browser can't fake them.
- **Who sees what:** senders see the invites they sent; recipients see invites addressed to their email; nobody else sees any. Status changes only through `cancel_invite()` (sender, pending only) and `accept_my_invites()` (called on sign-in: an invite is accepted when the recipient signs in with that address).
- **Dashboard:** five figures (sent, accepted, acceptance rate, pending, sent in the last 7 days) come from `invite_metrics()`, which counts the table on every call. Hub-wide totals only, no names or addresses, signed-in people only. Acceptance rate = accepted ÷ invites not cancelled.

## Hosting

**Live site:** https://vanshikasarin92-spec.github.io/my-vibe-coding-project-website/ (GitHub Pages, from the `gh-pages` branch of this repository).

To deploy a new version: `npm run build`, then commit the contents of `dist/` (plus an empty `.nojekyll` file) to the `gh-pages` branch. Asset paths are relative, so the same build also works on any static host or inside a SharePoint Framework (SPFx) web part.

Supabase settings for this address (Authentication in the Supabase dashboard): set the **Site URL** to the live site and add it under **Redirect URLs**, so confirmation emails return people to the hub. Supabase's built-in email sender only delivers to members of the Supabase team; add custom SMTP, or turn off "Confirm email", before colleagues sign up.

Guidance, not legal advice: confirm which Accessible Canada Act obligations apply with Legal and the Accessibility office.

## Analytics

The **Analytics** page (`#analytics`, signed-in only) shows visitors, page views, views per visit, average visit duration and bounce rate for the last 7, 30 or 90 days, with the change against the previous period, a daily chart and a pages table.

- **Counting:** `src/shared/hooks/usePageTracking.js` records one row in `page_views` per page opened, then the time it was on screen (hidden tabs don't count; each page caps at 30 minutes). A visit ends after 30 minutes with no page views. Rules: `src/shared/logic/visits.js`.
- **Privacy:** no names, emails or IP addresses. Each browser keeps a random id in local storage. Nobody can read rows from the browser; the page reads totals only, through `site_analytics()`.
- **Not counted:** localhost, test automation (`navigator.webdriver`), and browsers sending Do Not Track or Global Privacy Control.
- **Migration:** `supabase/migrations/20261120000500_page_views.sql`.
