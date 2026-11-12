# my-web-app

## Warehouse setup

Run the warehouse migrations in `supabase/migrations` in timestamp order in the
Supabase SQL editor for the project configured by `VITE_SUPABASE_URL`, or apply
them with the Supabase CLI. Run each migration only once. The migrations create
the warehouse tables and per-user row-level security policies, and enable
moving locations with their contents.

Signed-in users can create buildings, rooms within buildings, and numbered
containers within rooms. Create container types and select one for each new
container. Existing containers without a type are highlighted for assignment
in the location manager. A type in use cannot be deleted. Buildings, rooms,
containers and types can be edited; moving a room or container also moves its
contents. Add inventory to a container with a non-negative whole-number
quantity. Items can be edited, deleted, searched by name, and filtered by
location; inventory results are paginated on the server. Locations cannot be
deleted while they contain other locations or items.
