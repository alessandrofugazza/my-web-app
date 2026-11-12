create table public.warehouse_container_types (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 200),
  unique (user_id, id),
  unique (user_id, name)
);

alter table public.warehouse_container_types enable row level security;
grant select, insert, update, delete on public.warehouse_container_types to authenticated;

create policy "Users manage their warehouse container types" on public.warehouse_container_types
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

alter table public.warehouse_containers
  add column type_id uuid,
  add constraint warehouse_containers_type_fkey foreign key (user_id, type_id)
    references public.warehouse_container_types(user_id, id) on delete no action,
  add constraint warehouse_containers_type_required check (type_id is not null) not valid;
