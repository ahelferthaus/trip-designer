# Palau pilot

A small-group coordination concept added alongside the existing VYBR app. It ships in two parts: a public, fictional **sample** and a configuration-gated **private** workspace. Nothing here is a live trip, a booking system, or a verified privacy guarantee.

## Routes

| Route | Purpose | Backend |
| --- | --- | --- |
| `/pilot/palau` | Sample pilot with fictional travelers and a fictional 7–19 March 2030 window. Role selector is a UI preview, not authentication. Edits live in memory only. | None |
| `/pilot/private/:tripId` | Authenticated workspace for a real private trip. Fail-closed unless explicitly enabled. | Supabase (`palau_*` tables) |
| `/pilot/invite#token=…` | Accept an organizer invitation. Token stays in the URL fragment. | Supabase RPC |

All other paths continue to render the legacy app. The sample route is lazy-loaded and does not mount the legacy auth, store, or background providers.

## Sample vs. private

- **Sample** data lives in `src/lib/palauPilot.ts` and is deliberately generic: placeholder travelers, no flight numbers, no operator names, no contact details, and a clearly fictional date window. The essentials download is static text with no identity data.
- **Private** code paths (`src/lib/privateTripAccess.ts`, `src/lib/privateTripWorkspace.ts`, `src/pages/PrivateTrip*.tsx`) only run when `VITE_PALAU_PRIVATE_ENABLED` is exactly `true` and a Supabase client is configured. Otherwise the pages render a "not enabled" message and never initialize a client.
- Row Level Security in the database is the authorization boundary. Client-side checks only shape the UI.

## Setup

1. Copy `.env.example` to `.env`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (the legacy anon key is still accepted as a fallback). Never add secret or service-role keys as `VITE_` variables.
2. Apply `supabase/migrations/20261027161432_palau_private_pilot.sql` to a disposable project with the Supabase CLI. It creates the `palau_*` tables, the `palau_private` schema, invoker RPC wrappers, and a non-public `palau-private` storage bucket with restrictive policies.
3. Leave `VITE_PALAU_PRIVATE_ENABLED=false` until the checks below and your own staging review pass. Then set it to `true` for the environment that should expose the private routes.
4. Real trip content (titles, activities, shared tasks) is seeded server-side by an organizer-run SQL script with `app.palau_trip_id` set in the same session. No such seed is committed to this repository; the only seed-shaped file here is the synthetic test fixture under `supabase/tests/fixtures/`.

## Tests

```sh
npm test                 # sample model, static render, bundle hygiene (needs dist/ for the bundle test)
npm run test:rls         # PostgreSQL RLS and RPC suite in PGlite against the migration + synthetic fixture
npm run build && npm run test:private-bundle
npm run test:browser     # Playwright QA against a running `npm run dev`; see tests/palau-browser.mjs
```

- `tests/palau-pilot.test.mjs` covers sample permissions, RSVP capacity, the essentials download, and asserts the sample source carries no near-term dates, flight-style codes, or contact details.
- `tests/palau-render.test.mjs` statically renders every sample section and checks `index.html` has no external font requests and sends `referrer: no-referrer`.
- `tests/private-bundle.test.mjs` scans `dist/` for server-only seed paths, credential shapes, and the synthetic privacy canaries listed in `supabase/tests/fixtures/privacy-canaries.json`.
- `supabase/tests/private-pilot.rls.test.mjs` executes the migration in PGlite and exercises membership, invitations, checklists, travel details, RSVPs, journal, storage policies, revocation, and the synthetic seed fixture. Install PGlite locally or point `PGLITE_MODULE` at an existing build.
- `tests/palau-browser.mjs` writes screenshots and the downloaded essentials file to the OS temp directory by default (`PILOT_QA_OUTPUT` overrides). Set `CHROMIUM_PATH` to reuse an installed browser instead of downloading one.

## Limitations

- The build strips legacy browser-side print-provider keys even if inherited deployment variables still define them. Physical print/postcard delivery stays unavailable until a secure server integration exists; PDF export is unaffected.

- Access revalidation deliberately clears unsaved form drafts on focus/session changes. Save before switching tabs.
- Revoking a member also invalidates all outstanding trip invitations. Reissue invitations as needed; there is no self-service membership restoration or organizer transfer in this pilot.
- Arrival and departure fields are always Palau local time (UTC+9), independent of the browser timezone. Journal attachment removal happens before row deletion; a storage failure keeps the entry for retry.

- The RLS suite runs in PGlite with a stubbed `auth` schema. Supabase Auth, PostgREST, Storage uploads, signed URLs, and session handling are not exercised end-to-end here and are not claimed to be validated.
- The sample role selector and static tests are not evidence of deployed privacy. Treat the private routes as unreviewed until the migration and a staging test matrix have been approved in your own environment.
- The private workspace does not collect GPS, does not take payments, and does not create supplier bookings. "Confirmed" is a group plan status only.
- Do not enter passports, medical details, payment data, or access codes into any pilot surface.
