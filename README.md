# Pontevedra Tourism Platform

A tourism information platform for the Municipality of Pontevedra, Capiz, Philippines. It has two parts: a public-facing site where visitors browse destinations, events, and news, and an admin dashboard where staff manage that content.

Built with [Next.js](https://nextjs.org) (App Router), [Supabase](https://supabase.com) (database, storage, auth), and TypeScript.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site. The admin dashboard is under `/admin` (requires sign-in).

Environment variables needed (add to `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Project Structure

```
app/
  page.tsx                          # Public homepage
  admin/
    gallery/page.tsx                # Gallery upload manager
    events/page.tsx                 # News & events manager
    (locations)/                    # Uses ResourceManager for each category
  services/
    supabase/
      admin/
        add_location/route.ts       # Create a location
        update_location/route.ts    # Edit a location
        delete_location/route.ts    # Delete a location (+ its image)
        retrieve_location/route.ts  # Fetch by category, or counts for "all"
        gallery/route.ts            # Bulk image upload
        retrieve_gallery/route.ts
        delete_gallery/route.ts
        news/route.ts               # Create a news post
        retrieve_news/route.ts
        delete_news/route.ts
        events/route.ts             # Create an event
        retrieve_events/route.ts
        delete_events/route.ts
      auth/signin/route.ts
    jwt/
      auth/route.ts
      verify/route.ts
      deauth/route.ts
config/
  json_route.json                   # Central map of every API path
utilities/
  Fetch_to.ts                       # JSON POST/GET wrapper used everywhere
  Fetch_toFile.ts                   # multipart/form-data wrapper for uploads
```

Every route the frontend calls is looked up through `json_route.json` rather than hardcoded strings, so a path only needs to change in one place.

## Data Model (Supabase)

Six location category tables, all with the same shape:

| Table | Category label |
|---|---|
| `barangay` | Barangay |
| `beaches` | Beaches |
| `cafe` | Cafe |
| `heritage` | Heritage |
| `resort` | Resort |
| `touristspot` | Tourist Spot |

Columns: `id`, `name`, `locations`, `facebook_page`, `gmail`, `transportations` (jsonb array of `{type, description}`), `about`, `image_src`, `iframe_link`, `image_dir`.

Supporting tables:

- **`gallery`** — `image_link`, `src_path` (standalone image uploads, no category).
- **`news`** / **`event`** — `locations_type`, `located_in`, `description`, plus six nullable foreign key columns (`barangay_id`, `beaches_id`, `cafe_id`, `heritage_id`, `resort_id`, `touristspot_id`), one per category. A `CHECK` constraint enforces that exactly one of the six is filled per row. `event` additionally has a `date` column.

This "one column per possible table" pattern exists because Postgres can't have a single foreign key reference multiple tables conditionally — each news/event post can point at a barangay *or* a beach *or* a cafe, etc., and the six-column approach keeps real FK enforcement (with `ON DELETE CASCADE`, so deleting a location also removes any news/events that referenced it).

## Admin Features

- **Location management** (`ResourceManager` component, reused per category): list, search, view details, edit, and delete with a 5-second undo window before the delete actually hits the database.
- **Gallery**: bulk image upload to Supabase Storage, live preview grid of previously uploaded images, per-image delete (removes both the storage file and the database row).
- **News & Events**: two-step location picker (choose a category, then choose a specific place in that category), posts show newest-first.
- All list views auto-refresh after create/update/delete so the admin never needs to manually reload.

## Public Site Features

- Destination sections per category, each pulling live data from `retrieve_location`.
- A destination detail modal showing description, Facebook/contact info, transportation options, and a real embedded map — all sourced from the record's actual data, with graceful fallbacks (a generic Pontevedra map, a gradient placeholder image, "N/A" text) when a field is empty.
- A location map section with a two-step dropdown (category, then place) that renders that place's saved Google Maps embed link.
- A search bar that live-filters across all destinations by name and location, with results opening straight into the detail modal.
- Latest News and Upcoming Events sections, sourced from the `news`/`event` tables and matched back to their location's photo where available.
- A gallery section pulling every uploaded image.

## Known Constraints

- `iframe_link` must be a Google Maps **embed** URL (from Maps → Share → Embed a map), not a regular share link (`maps.app.goo.gl/...`) — Google blocks share links from loading inside an `<iframe>`.
- Free-text fields like `facebook_page` aren't validated on entry, so display code normalizes URLs (adding `https://` if missing) before using them as links.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)