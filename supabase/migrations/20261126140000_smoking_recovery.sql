create table public.smoking_recovery (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  started_at timestamptz
);

alter table public.smoking_recovery enable row level security;

grant select, insert, update on public.smoking_recovery to authenticated;

create policy "Users manage their smoking recovery" on public.smoking_recovery
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
