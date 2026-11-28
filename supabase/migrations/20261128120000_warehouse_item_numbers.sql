alter table public.warehouse_items
  add column number integer check (number >= 0),
  add constraint warehouse_items_user_number_key unique (user_id, number);
