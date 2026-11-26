# my-web-app

## Smoking and alcohol recovery

Signed-in users can track smoking and alcohol recovery independently from the
Recovery page, see reached milestones and the countdown to the next one, reset
either timer, or start over using the current time or a past local date and time.
Major milestone tags highlight selected entries in both the next and reached
milestones; they indicate significance, not confirmed individual outcomes.
Run `supabase/migrations/20261126140000_smoking_recovery.sql` in the Supabase SQL
editor (or apply it with the Supabase CLI) before using the page. The start
time is saved to the signed-in account and is available across devices. If the
account has no recovery record, visiting the page in a browser with an older
local start time imports it. An account's existing record, including a reset,
takes precedence over old browser data.
Also run `supabase/migrations/20261126150000_alcohol_recovery.sql` to enable the
separate alcohol tracker.
The two-week timeline is approximate and is not medical advice.

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
