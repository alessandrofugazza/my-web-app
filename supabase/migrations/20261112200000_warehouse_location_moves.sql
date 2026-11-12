begin;

alter table public.warehouse_containers
  drop constraint warehouse_containers_user_id_building_id_room_id_fkey,
  add constraint warehouse_containers_user_id_building_id_room_id_fkey
    foreign key (user_id, building_id, room_id)
    references public.warehouse_rooms(user_id, building_id, id)
    on update cascade on delete no action;

alter table public.warehouse_items
  drop constraint warehouse_items_user_id_building_id_room_id_container_id_fkey,
  add constraint warehouse_items_user_id_building_id_room_id_container_id_fkey
    foreign key (user_id, building_id, room_id, container_id)
    references public.warehouse_containers(user_id, building_id, room_id, id)
    on update cascade on delete no action;

-- Existing untyped containers must remain movable until the user assigns a type.
alter table public.warehouse_containers drop constraint warehouse_containers_type_required;

create function public.warehouse_require_container_type()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.type_id is null and (tg_op = 'INSERT' or old.type_id is not null) then
    raise exception 'A container type is required' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger warehouse_container_type_required
  before insert or update of type_id on public.warehouse_containers
  for each row execute function public.warehouse_require_container_type();

commit;
