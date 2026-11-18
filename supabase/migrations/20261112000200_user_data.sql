-- Accessible by Default: per-person data and usage events.
-- Replaces what the prototype keeps in localStorage (abd-profile, abd-role,
-- abd-checks, abd-tab), so a profile follows a person across devices once they
-- sign in with Supabase Auth. Every row belongs to auth.uid(); people can only
-- see and change their own rows.

-- Profile ---------------------------------------------------------------------

create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  role_id            text references public.roles (id),          -- null until the Role picker
  lang               text not null default 'en' check (lang in ('en', 'fr')),
  library_role_id    text references public.library_roles (id),  -- was abd-role
  platform_tab       text not null default 'web' check (platform_tab in ('web', 'ios', 'android')), -- was abd-tab
  last_visit_at      timestamptz,
  prev_visit_at      timestamptz,                                -- set => Welcome back (PRD R7)
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- "Do this now" / "Do this next" marked done, per role (a person can change role
-- and keep what they did for the old one, as in the prototype).
create table public.action_completions (
  user_id      uuid not null references public.profiles (id) on delete cascade,
  role_id      text not null references public.roles (id),
  kind         text not null check (kind in ('do', 'next')),
  completed_at timestamptz not null default now(),
  primary key (user_id, role_id, kind)
);

-- One row per visit (a new browser session), for the 14-day return metric.
create table public.visits (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  visited_at timestamptz not null default now()
);
create index visits_user_visited_idx on public.visits (user_id, visited_at desc);

-- Checklist ticks (was abd-checks).
create table public.checklist_ticks (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  item_id    text not null references public.checklist_items (id) on delete cascade,
  ticked     boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

-- Usage events (PRD "Data & events"). No personal data: no user id, only an
-- anonymous id the browser makes per session. Insert-only from the app; read
-- them from the dashboard or with the service role.
create table public.events (
  id         bigint generated always as identity primary key,
  session_id uuid not null,
  name       text not null check (name in (
               'screen_view', 'role_picked', 'requirement_opened', 'requirement_closed',
               'do_now_click', 'copied', 'action_done', 'do_next_click', 'next_action_done',
               'view_requirements', 'language_switch', 'change_role', 'back',
               'resume_last_action', 'load_failed', 'retry', 'bounce', 'exit')),
  role_id    text references public.roles (id),
  lang       text check (lang in ('en', 'fr')),
  screen     text,
  props      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index events_name_created_idx on public.events (name, created_at);
create index events_session_idx on public.events (session_id, created_at);

-- Housekeeping ----------------------------------------------------------------

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger checklist_ticks_touch before update on public.checklist_ticks
  for each row execute function public.touch_updated_at();

-- Every new Supabase Auth user gets an empty profile (role picked later).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row level security ----------------------------------------------------------

alter table public.profiles           enable row level security;
alter table public.action_completions enable row level security;
alter table public.visits             enable row level security;
alter table public.checklist_ticks    enable row level security;
alter table public.events             enable row level security;

create policy "Read own profile"   on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "Update own profile" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Own action completions" on public.action_completions for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Read own visits" on public.visits for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Add own visits"  on public.visits for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Own checklist ticks" on public.checklist_ticks for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Anyone can send events" on public.events for insert to anon, authenticated
  with check (true);

-- Functions the app calls -----------------------------------------------------

-- Start a visit: logs it and moves last_visit_at to prev_visit_at, like the
-- prototype does on a new browser session. Call once per session.
-- Returns the updated profile; prev_visit_at not null => show Welcome back.
create function public.start_visit()
returns public.profiles
language plpgsql
security invoker
set search_path = ''
as $$
declare p public.profiles;
begin
  insert into public.visits (user_id) values (auth.uid());
  update public.profiles
     set prev_visit_at = last_visit_at,
         last_visit_at = now()
   where id = auth.uid()
  returning * into p;
  return p;
end;
$$;

-- What's new for the signed-in person's role since their previous visit
-- (PRD R8): news dated after prev_visit_at whose topic maps to the role.
create function public.whats_new()
returns table (id bigint, published_on date, date_label text, topic_id text, title text)
language sql
stable
security invoker
set search_path = ''
as $$
  select n.id, n.published_on, n.date_label, n.topic_id, n.title
    from public.profiles p
    join public.topic_roles tr on tr.role_id = p.role_id
    join public.news_items n   on n.topic_id = tr.topic_id
   where p.id = auth.uid()
     and p.prev_visit_at is not null
     and n.published_on > p.prev_visit_at::date
   order by n.published_on desc;
$$;

-- Functions are executable by PUBLIC by default; only signed-in people may call these.
revoke execute on function public.start_visit() from public, anon;
revoke execute on function public.whats_new() from public, anon;
grant  execute on function public.start_visit() to authenticated;
grant  execute on function public.whats_new() to authenticated;
-- Trigger-only function: nobody calls it directly.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
