-- Last-write-wins for records a person can edit from two places at once
-- (two tabs, two devices, or an offline device catching up).
-- The app sends client_updated_at: when the person made the change on their
-- device. An update carrying an older client_updated_at than the stored row is
-- ignored, so the most recent edit wins even if it arrives first.
-- action_completions needs no rule: rows are only ever added, never changed.

alter table public.profiles        add column client_updated_at timestamptz;
alter table public.checklist_ticks add column client_updated_at timestamptz;

create function public.keep_latest_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- A device clock far ahead must not lock a row: cap at a few minutes past now.
  if new.client_updated_at is not null and new.client_updated_at > now() + interval '5 minutes' then
    new.client_updated_at := now();
  end if;
  -- Older than what is stored: keep the stored row unchanged. Updates that don't
  -- touch client_updated_at (such as start_visit()) keep the old value and pass.
  if tg_op = 'UPDATE' and old.client_updated_at is not null and new.client_updated_at is not null
     and new.client_updated_at < old.client_updated_at then
    return old;
  end if;
  return new;
end;
$$;

-- Named zz_ so it fires after the updated_at triggers (Postgres fires them in name
-- order); returning OLD then leaves the stored row exactly as it was.
create trigger zz_profiles_keep_latest before insert or update on public.profiles
  for each row execute function public.keep_latest_write();
create trigger zz_checklist_ticks_keep_latest before insert or update on public.checklist_ticks
  for each row execute function public.keep_latest_write();

revoke execute on function public.keep_latest_write() from public, anon, authenticated;
