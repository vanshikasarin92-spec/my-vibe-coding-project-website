-- Accessible by Default: anonymous page-view analytics.
--
-- One row per page view. No personal data: no user id, email or IP address.
-- visitor_id is a random id the browser keeps (one per browser), session_id a
-- random id for one visit (a new visit starts after 30 minutes of inactivity).
-- The app writes rows; nobody can read them directly. The Analytics page reads
-- totals only, through site_analytics().

create table public.page_views (
  id          uuid primary key,                 -- made by the browser, so it can report the time later
  visitor_id  uuid not null,
  session_id  uuid not null,
  page        text not null check (page ~ '^[a-z0-9-]{1,40}$'),
  started_at  timestamptz not null default now(),
  duration_ms integer check (duration_ms between 0 and 1800000)  -- time on page, capped at 30 minutes
);
create index page_views_started_idx on public.page_views (started_at);
create index page_views_session_idx on public.page_views (session_id, started_at);

alter table public.page_views enable row level security;

-- Anyone may record a view; no select, update or delete policies, so rows can't
-- be read or changed from the browser.
create policy "Anyone can record a page view" on public.page_views
  for insert to anon, authenticated with check (true);

-- The server sets the time and starts the duration empty, whatever the browser sends.
create function public.prepare_page_view()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.started_at := now();
  new.duration_ms := null;
  return new;
end;
$$;

create trigger prepare_page_view before insert on public.page_views
  for each row execute function public.prepare_page_view();

-- Records how long a page was looked at. Called when the person moves to another
-- page or leaves the tab, possibly more than once per view: the largest value is
-- kept. Only the browser that made the view knows both ids, and only views from
-- the last day can be changed.
create function public.end_page_view(view_id uuid, visitor uuid, ms integer)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.page_views
     set duration_ms = greatest(coalesce(duration_ms, 0), least(greatest(ms, 0), 1800000))
   where id = view_id
     and visitor_id = visitor
     and started_at > now() - interval '1 day';
$$;

revoke execute on function public.end_page_view(uuid, uuid, integer) from public;
grant execute on function public.end_page_view(uuid, uuid, integer) to anon, authenticated;

-- Totals for the Analytics page: the last `days` days (1–365) and the period
-- before it, a per-day series and the most viewed pages. Days are counted in
-- Toronto time. Signed-in people only; no row-level detail leaves the database.
--   visitors        distinct browsers
--   page_views      rows
--   visits          distinct sessions
--   views_per_visit page_views / visits
--   avg_visit_ms    average over visits of the summed time on its pages
--   bounce_rate     % of visits with exactly one page view
create function public.site_analytics(days integer default 30)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with params as (
    select least(greatest(coalesce(days, 30), 1), 365) as n,
           (now() at time zone 'America/Toronto')::date as today
  ),
  bounds as (
    select n, today,
           ((today - (n - 1))     ::timestamp at time zone 'America/Toronto') as cur_start,
           ((today - (2 * n - 1)) ::timestamp at time zone 'America/Toronto') as prev_start
      from params
  ),
  v as (
    select pv.*, (pv.started_at >= b.cur_start) as is_current,
           (pv.started_at at time zone 'America/Toronto')::date as day
      from public.page_views pv, bounds b
     where pv.started_at >= b.prev_start
  ),
  sessions as (
    select is_current, session_id, count(*) as views, sum(coalesce(duration_ms, 0)) as ms
      from v group by is_current, session_id
  ),
  totals as (
    select p.is_current,
           (select count(distinct visitor_id) from v where v.is_current = p.is_current) as visitors,
           (select count(*) from v where v.is_current = p.is_current) as page_views,
           count(*) as visits,
           round(avg(ms))::bigint as avg_visit_ms,
           round(100.0 * count(*) filter (where views = 1) / nullif(count(*), 0), 1) as bounce_rate
      from (select true as is_current union all select false) p
      left join sessions s on s.is_current = p.is_current
     group by p.is_current
  ),
  period as (
    select is_current, jsonb_build_object(
             'visitors', visitors,
             'page_views', page_views,
             'visits', case when page_views = 0 then 0 else visits end,
             'views_per_visit', case when page_views = 0 then null
                                     else round(page_views::numeric / visits, 2) end,
             'avg_visit_ms', case when page_views = 0 then null else avg_visit_ms end,
             'bounce_rate', case when page_views = 0 then null else bounce_rate end) as j
      from totals
  ),
  series as (
    select jsonb_agg(jsonb_build_object(
             'day', d.day,
             'visitors', coalesce(x.visitors, 0),
             'page_views', coalesce(x.page_views, 0)) order by d.day) as j
      from bounds b
      cross join lateral generate_series(b.today - (b.n - 1), b.today, interval '1 day') as g(day_ts)
      cross join lateral (select g.day_ts::date as day) d
      left join (
        select day, count(distinct visitor_id) as visitors, count(*) as page_views
          from v where is_current group by day
      ) x on x.day = d.day
  ),
  pages as (
    select coalesce(jsonb_agg(jsonb_build_object(
             'page', page, 'page_views', page_views, 'visitors', visitors,
             'avg_time_ms', avg_time_ms) order by page_views desc, page), '[]'::jsonb) as j
      from (
        select page, count(*) as page_views, count(distinct visitor_id) as visitors,
               round(avg(duration_ms))::bigint as avg_time_ms
          from v where is_current group by page
      ) t
  )
  select case when (select auth.uid()) is null then null else jsonb_build_object(
    'days', (select n from bounds),
    'current', (select j from period where is_current),
    'previous', (select j from period where not is_current),
    'series', (select j from series),
    'pages', (select j from pages),
    'as_of', now()
  ) end;
$$;

revoke execute on function public.site_analytics(integer) from public, anon;
grant execute on function public.site_analytics(integer) to authenticated;
