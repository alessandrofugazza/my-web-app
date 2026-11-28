# my-web-app

## Chrome extension data

The Extension Data page lets signed-in users view, edit, and delete their existing
extension pages, page notes, and reading locations. Sign in with the same
Supabase account as the extension. Search URLs in any section; the filter
also applies to notes' associated page URLs. IDs, ownership, and creation timestamps are
read-only. Page URLs and reading-location URLs are independent; changing one
does not change the other. The extension matches URLs exactly.
Each section can be sorted by creation date and time, newest or oldest first.
The Pages section shows the number of accessible notes for each page.
Deleting a page may also delete its notes if the database cascades deletions;
otherwise existing notes may prevent deletion. Reading locations are separate.
Deletions require confirmation in the app.

This page uses the extension's existing tables and requires authenticated
select, update, and delete grants and row-level security policies for the user's own
records, including notes belonging to their pages. No schema changes are
required if those permissions are already configured.

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
contents. Database changes show a green success or red failure notification.
Deletions require confirmation in the app.
Add inventory to a container with a non-negative whole-number
quantity. Each inventory entry can optionally have a non-negative whole-number
item number, which must be unique within the user's warehouse, regardless of
quantity or location. Items can be edited, deleted, searched by name, and
filtered by location; inventory results are paginated on the server. Locations cannot be
deleted while they contain other locations or items.
