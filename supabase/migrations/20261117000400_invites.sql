-- Invites: a signed-in person invites a colleague to the hub by email.
-- Columns asked for: sender_email, recipient_email, status, timestamp (created_at).
-- The database sets the sender and the time itself, so neither can be faked.
-- An invite is accepted when the recipient signs in with that email address.

create table public.invites (
  id              bigint generated always as identity primary key,
  sender_id       uuid not null references auth.users (id) on delete cascade,
  sender_email    text not null,
  recipient_email text not null check (recipient_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  status          text not null default 'pending'
                  check (status in ('pending', 'accepted', 'cancelled')),
  created_at      timestamptz not null default now(),   -- when it was sent
  responded_at    timestamptz                           -- when it was accepted or cancelled
);
-- One open invite per sender and recipient (a cancelled one can be sent again).
create unique index invites_sender_recipient_idx on public.invites (sender_id, recipient_email)
  where status <> 'cancelled';
create index invites_recipient_idx on public.invites (recipient_email);
create index invites_created_idx on public.invites (created_at);

-- On insert: the sender is whoever is signed in, the email comes from their
-- session, the recipient is lower-cased, and every invite starts pending, now.
create function public.prepare_invite()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.sender_id := auth.uid();
  new.sender_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  new.recipient_email := lower(trim(new.recipient_email));
  new.status := 'pending';
  new.created_at := now();
  new.responded_at := null;
  if new.sender_id is null or new.sender_email = '' then
    raise exception 'Sign in to send invites' using errcode = '42501';
  end if;
  if new.recipient_email = new.sender_email then
    raise exception 'You cannot invite yourself' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger invites_prepare before insert on public.invites
  for each row execute function public.prepare_invite();

alter table public.invites enable row level security;

-- Senders see what they sent; recipients see invites addressed to their email.
create policy "Read invites I sent or received" on public.invites for select to authenticated
  using (
    (select auth.uid()) = sender_id
    or recipient_email = lower((select auth.jwt()) ->> 'email')
  );
-- Anyone signed in can send (the trigger fills in who and when).
create policy "Send invites" on public.invites for insert to authenticated
  with check (true);
-- No update or delete policies: status changes only through the functions below.

-- Cancel one of my pending invites.
create function public.cancel_invite(invite_id bigint)
returns boolean
language sql
security definer
set search_path = ''
as $$
  with done as (
    update public.invites
       set status = 'cancelled', responded_at = now()
     where id = invite_id and sender_id = auth.uid() and status = 'pending'
    returning 1
  )
  select exists (select 1 from done);
$$;

-- Accept every pending invite addressed to the signed-in person's email.
-- The app calls it after sign-in. Returns how many were accepted.
create function public.accept_my_invites()
returns integer
language sql
security definer
set search_path = ''
as $$
  with done as (
    update public.invites
       set status = 'accepted', responded_at = now()
     where status = 'pending'
       and recipient_email = lower(auth.jwt() ->> 'email')
       and auth.uid() is not null
    returning 1
  )
  select count(*)::int from done;
$$;

-- Dashboard metrics, computed from the table on every call. Hub-wide totals
-- only (no names or addresses), plus the caller's own counts. Signed-in only.
create function public.invite_metrics()
returns table (
  sent bigint,
  accepted bigint,
  pending bigint,
  cancelled bigint,
  acceptance_rate numeric,
  sent_last_7_days bigint,
  accepted_last_7_days bigint,
  my_sent bigint,
  my_accepted bigint,
  as_of timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    count(*),
    count(*) filter (where status = 'accepted'),
    count(*) filter (where status = 'pending'),
    count(*) filter (where status = 'cancelled'),
    round(100.0 * count(*) filter (where status = 'accepted')
          / nullif(count(*) filter (where status <> 'cancelled'), 0), 1),
    count(*) filter (where created_at >= now() - interval '7 days'),
    count(*) filter (where status = 'accepted' and responded_at >= now() - interval '7 days'),
    count(*) filter (where sender_id = auth.uid()),
    count(*) filter (where sender_id = auth.uid() and status = 'accepted'),
    now()
  from public.invites
  where auth.uid() is not null;
$$;

revoke execute on function public.prepare_invite() from public, anon, authenticated;
revoke execute on function public.cancel_invite(bigint) from public, anon;
revoke execute on function public.accept_my_invites() from public, anon;
revoke execute on function public.invite_metrics() from public, anon;
grant execute on function public.cancel_invite(bigint) to authenticated;
grant execute on function public.accept_my_invites() to authenticated;
grant execute on function public.invite_metrics() to authenticated;
