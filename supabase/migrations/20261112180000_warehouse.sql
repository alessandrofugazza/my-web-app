create table public.warehouse_buildings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 200),
  unique (user_id, id),
  unique (user_id, name)
);

create table public.warehouse_rooms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  building_id uuid not null,
  name text not null check (length(trim(name)) between 1 and 200),
  unique (user_id, building_id, id),
  unique (user_id, building_id, name),
  foreign key (user_id, building_id) references public.warehouse_buildings(user_id, id) on delete no action
);

create table public.warehouse_containers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  building_id uuid not null,
  room_id uuid not null,
  number integer not null check (number >= 0),
  unique (user_id, building_id, room_id, id),
  unique (user_id, building_id, room_id, number),
  foreign key (user_id, building_id, room_id)
    references public.warehouse_rooms(user_id, building_id, id) on delete no action
);

create table public.warehouse_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  building_id uuid not null,
  room_id uuid not null,
  container_id uuid not null,
  name text not null check (length(trim(name)) between 1 and 200),
  quantity integer not null check (quantity >= 0),
  foreign key (user_id, building_id, room_id, container_id)
    references public.warehouse_containers(user_id, building_id, room_id, id) on delete no action
);

create index warehouse_items_user_name_id_idx on public.warehouse_items(user_id, name, id);
create index warehouse_items_location_idx on public.warehouse_items(user_id, building_id, room_id, container_id);

alter table public.warehouse_buildings enable row level security;
alter table public.warehouse_rooms enable row level security;
alter table public.warehouse_containers enable row level security;
alter table public.warehouse_items enable row level security;

grant select, insert, update, delete on public.warehouse_buildings, public.warehouse_rooms,
  public.warehouse_containers, public.warehouse_items to authenticated;

create policy "Users manage their warehouse buildings" on public.warehouse_buildings
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage their warehouse rooms" on public.warehouse_rooms
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage their warehouse containers" on public.warehouse_containers
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage their warehouse items" on public.warehouse_items
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
