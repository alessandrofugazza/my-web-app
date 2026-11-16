alter table public.warehouse_containers add column name text;

-- Backfill existing containers with unique placeholder names.
update public.warehouse_containers c
set name = 'Container ' || c.number || case when r.rn > 1 then ' (' || r.rn || ')' else '' end
from (
  select id, row_number() over (partition by user_id, number order by id) as rn
  from public.warehouse_containers
) r
where r.id = c.id;

alter table public.warehouse_containers
  alter column name set not null,
  add constraint warehouse_containers_name_check check (length(trim(name)) between 1 and 200);

create unique index warehouse_containers_user_name_key
  on public.warehouse_containers (user_id, lower(trim(name)));
