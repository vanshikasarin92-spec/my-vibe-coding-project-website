-- Accessible by Default: content tables.
-- Everything the hub shows that is the same for every person: roles and their
-- views, ACA deadlines, news, the resource library and the release checklists.
-- English and French live side by side as _en / _fr columns where the prototype
-- has both; news and the library are English only, as in the prototype.
-- Readable by everyone (anon and signed in); written only from the dashboard or
-- with the service role (no insert/update/delete policies).

-- Roles -----------------------------------------------------------------------

-- Library filter roles (Resource library). Your role's "Team lead" maps to 'pm'.
create table public.library_roles (
  id          text primary key,                 -- des, pm, po, dev, qa, proc
  label       text not null,                    -- "Product managers"
  short_label text not null,                    -- "PM" (chip on each resource)
  lead        text,                             -- "Product managers:"
  intro       text not null,
  sort_order  int  not null
);

-- The six Your role roles.
create table public.roles (
  id             text primary key,              -- dev, po, des, qa, proc, lead
  sort_order     int  not null,
  library_role   text not null references public.library_roles (id),
  name_en        text not null,
  name_fr        text not null,
  blurb_en       text not null,
  blurb_fr       text not null,
  plural_en      text not null,                 -- used in "Nothing new for developers…"
  plural_fr      text not null,
  deadline_2027_en text not null,               -- what the 5 Dec 2027 date means for this role
  deadline_2027_fr text not null,
  deadline_2028_en text not null,
  deadline_2028_fr text not null,
  note_en        text not null,
  note_fr        text not null
);

-- The criteria that apply to a role (Role view, PRD R3).
create table public.role_criteria (
  id         bigint generated always as identity primary key,
  role_id    text not null references public.roles (id) on delete cascade,
  position   int  not null,
  tag        text check (tag in ('req', 'target', 'en')),   -- WCAG 2.1 required / WCAG 2.2 target / EN 301 549
  title_en   text not null,                     -- "4.1.2 Name, Role, Value"
  title_fr   text not null,
  summary_en text not null,
  summary_fr text not null,
  detail_en  text not null,
  detail_fr  text not null,
  unique (role_id, position)
);

-- "Do this now" (kind = 'do', PRD R5) and "Do this next" (kind = 'next', R6).
create table public.role_actions (
  role_id          text not null references public.roles (id) on delete cascade,
  kind             text not null check (kind in ('do', 'next')),
  title_en         text not null,
  title_fr         text not null,
  summary_en       text not null,
  summary_fr       text not null,
  button_en        text not null,               -- card button: "Set it up"
  button_fr        text not null,
  intro_en         text not null,
  intro_fr         text not null,
  steps_en         text[] not null,
  steps_fr         text[] not null,
  copy_heading_en  text,                        -- only actions with text to copy
  copy_heading_fr  text,
  copy_button_en   text,
  copy_button_fr   text,
  copy_text_en     text,
  copy_text_fr     text,                        -- null = show the English text (code snippets)
  done_button_en   text not null,               -- "I've added it"
  done_button_fr   text not null,
  done_title_en    text not null,               -- Action done screen
  done_title_fr    text not null,
  done_body_en     text not null,
  done_body_fr     text not null,
  done_next_en     text[],                      -- "What happens next" (Do this now only)
  done_next_fr     text[],
  primary key (role_id, kind)
);

-- Accessible Canada Regulations digital deadlines.
create table public.deadlines (
  id       text primary key,                    -- y2027, y2028
  due_on   date not null,
  label_en text not null,
  label_fr text not null
);

-- News ------------------------------------------------------------------------

create table public.news_topics (
  id         text primary key,                  -- canada, standards, law, mobile, research
  label      text not null,
  sort_order int  not null
);

-- Which roles see a topic's news as "What's new" on a return visit (PRD R8).
create table public.topic_roles (
  topic_id text not null references public.news_topics (id) on delete cascade,
  role_id  text not null references public.roles (id) on delete cascade,
  primary key (topic_id, role_id)
);

create table public.news_items (
  id            bigint generated always as identity primary key,
  published_on  date not null,                  -- drives "What's new since your last visit"
  date_label    text not null,                  -- "2 Sep 2026" or "Sep 2026" when the day isn't known
  topic_id      text not null references public.news_topics (id),
  tag           text not null,
  title         text not null unique,
  body          text not null,
  means_lead    text not null,                  -- "For us:"
  means         text not null,
  sources_label text not null default 'Sources:'
);
create index news_items_published_on_idx on public.news_items (published_on desc);

create table public.news_sources (
  news_id  bigint not null references public.news_items (id) on delete cascade,
  position int    not null,
  label    text   not null,
  url      text   not null,
  primary key (news_id, position)
);

-- Resource library ------------------------------------------------------------

create table public.resource_groups (
  id         bigint generated always as identity primary key,
  name       text not null unique,
  sort_order int  not null
);

create table public.resources (
  id          bigint generated always as identity primary key,
  group_id    bigint not null references public.resource_groups (id) on delete cascade,
  position    int  not null,
  title       text not null,
  url         text not null,
  description text not null,
  unique (group_id, position)
);

create table public.resource_roles (
  resource_id     bigint not null references public.resources (id) on delete cascade,
  library_role_id text   not null references public.library_roles (id) on delete cascade,
  primary key (resource_id, library_role_id)
);

-- Release checklists ----------------------------------------------------------

create table public.checklists (
  id         text primary key,                  -- ck-design, ck-eng, ck-qa
  title      text not null,
  sort_order int  not null
);

create table public.checklist_items (
  id           text primary key,                -- d1, e1, q1 … (kept from the prototype)
  checklist_id text not null references public.checklists (id) on delete cascade,
  position     int  not null,
  text         text not null,
  unique (checklist_id, position)
);

-- WCAG references (grey) and CAN/ASC-EN 301 549 clauses beyond WCAG (red).
create table public.checklist_item_refs (
  item_id      text    not null references public.checklist_items (id) on delete cascade,
  position     int     not null,
  ref          text    not null,                -- "1.4.3 · 1.4.11" or "EN 11.7"
  is_en_clause boolean not null default false,
  primary key (item_id, position)
);

-- Read access -----------------------------------------------------------------

do $$
declare t text;
begin
  foreach t in array array[
    'library_roles', 'roles', 'role_criteria', 'role_actions', 'deadlines',
    'news_topics', 'topic_roles', 'news_items', 'news_sources',
    'resource_groups', 'resources', 'resource_roles',
    'checklists', 'checklist_items', 'checklist_item_refs'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "Content is readable by everyone" on public.%I for select to anon, authenticated using (true)',
      t
    );
  end loop;
end $$;
