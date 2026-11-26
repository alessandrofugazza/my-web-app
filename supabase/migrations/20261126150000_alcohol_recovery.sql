create table public.alcohol_recovery (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  started_at timestamptz
);

alter table public.alcohol_recovery enable row level security;

grant select, insert, update on public.alcohol_recovery to authenticated;

create policy "Users manage their alcohol recovery" on public.alcohol_recovery
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
