alter table public.warehouse_items
  add column notes text check (notes is null or length(notes) <= 2000);
