# Palau pilot

A small-group coordination concept added alongside the existing VYBR app. It ships in two parts: a public, fictional **sample** and a configuration-gated **private** workspace. Nothing here is a live trip, a booking system, or a verified privacy guarantee. The pilot is **not production-ready**.

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

## Group size

The pilot group is **exactly eight people in total**: one organizer plus seven travelers. The sample model exports `PILOT_EXPECTED_GROUP_SIZE = 8` and eight fictional members (Travelers A–G plus the organizer); the visible group count on the sample page reads from that constant. Activity capacity is activity-specific coordination and is **not** tied to group size: a four-seat sample table stays four seats, and the other travelers choose Maybe or Not going. The database enforces membership and capacity, not a maximum roster; "eight" is a coordination expectation the organizer manages through invitations.

## Setup

1. Copy `.env.example` to `.env`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (the legacy anon key is still accepted as a fallback). Never add secret or service-role keys as `VITE_` variables.
2. Apply `supabase/migrations/20261027161432_palau_private_pilot.sql` to a disposable project with the Supabase CLI. It creates the `palau_*` tables, the `palau_private` schema, invoker RPC wrappers, and a non-public `palau-private` storage bucket with restrictive policies.
   Existing installations with owner-only photo deletion also need `20261030203411_palau_linked_journal_media_moderation.sql`. Review and apply that forward migration in staging before testing organizer moderation; it permits only linked same-trip journal attachments and leaves unlinked uploads owner-only. It is tested locally, not automatically applied to a hosted project.
3. Leave `VITE_PALAU_PRIVATE_ENABLED=false` until the checks below and your own staging review pass. Then set it to `true` for the environment that should expose the private routes.
4. Real trip content (titles, activities, shared tasks) is seeded server-side by an organizer-run SQL script with `app.palau_trip_id` set in the same session. No such seed is committed to this repository; the only seed-shaped file here is the synthetic test fixture under `supabase/tests/fixtures/`.

### Eight-person setup and readiness checklist

Work through this in a disposable staging project before anyone real is involved. None of it is done by this repository, and no invitations or data imports are part of the codebase.

1. Organizer signs in with a verified (confirmed, non-anonymous) account and creates the trip with `palau_create_trip`.
2. Organizer issues **seven** invitations with `palau_create_invite`, one per traveler email, and delivers each link out of band. Tokens live only in the URL fragment; the database stores a SHA-256 hash.
3. Each traveler accepts with their own verified account. Confirm the roster shows one organizer and seven travelers and that a replayed link is refused.
4. Each person enters their own arrival window (group-visible) and, separately, their own exact travel details (owner plus organizer only). Spot-check from two traveler accounts that neither can read the other's travel details or personal checklist.
5. Organizer adds activities with realistic per-activity capacity. Do not set capacity to the group size unless the activity really has eight places.
6. Run the capacity drill from eight real sessions (see "Required hosted evidence"). Confirm exactly the capacity count succeed, a refused Going leaves no row, Maybe still works, and a decline frees a seat.
7. Revoke one traveler and confirm from that account that every trip surface, RPC, and the private bucket are denied, and that a fresh invitation does not restore them.
8. Keep `VITE_PALAU_PRIVATE_ENABLED=false` in production until every item above has been recorded against the hosted project.

## Tests

```sh
npm test                 # sample model, static render, bundle hygiene (needs dist/ for the bundle test)
npm run test:rls         # PostgreSQL RLS and RPC suites in PGlite against the migration + synthetic fixture
npm run build && npm run test:private-bundle
npm run test:browser     # Playwright QA against a running `npm run dev`; see tests/palau-browser.mjs
```

- `tests/palau-pilot.test.mjs` covers sample permissions for all eight views, independent personal checklist ownership, RSVP capacity including a four-seat activity in an eight-person group, the group-size constant, the essentials download, and asserts the sample source carries no near-term dates, flight-style codes, or contact details.
- `tests/palau-render.test.mjs` statically renders every sample section, checks the eight-member view selector and group count, and checks `index.html` has no external font requests and sends `referrer: no-referrer`.
- `tests/private-bundle.test.mjs` scans `dist/` for server-only seed paths, credential shapes, and the synthetic privacy canaries listed in `supabase/tests/fixtures/privacy-canaries.json`.
- `supabase/tests/private-pilot.rls.test.mjs` executes the migration in PGlite and exercises membership, invitations, checklists, travel details, RSVPs, journal, storage policies, revocation, and the synthetic seed fixture.
- `supabase/tests/private-pilot.eight.rls.test.mjs` builds a fresh synthetic Auth/Storage harness with eight verified identities plus an outsider: organizer-issued invitations accepted without email delivery, per-person travel-detail and checklist visibility, organizer boundaries, outsider and logged-out denial, eight Going submissions competing for four seats, idempotent repeats, decline and revocation freeing seats, a revoked identity denied everywhere, and journal/media boundaries. Install PGlite locally or point `PGLITE_MODULE` at an existing build.
- `tests/palau-browser.mjs` walks all eight sample views, the four-seat table, and the existing flows. It writes screenshots and the downloaded essentials file to the OS temp directory by default (`PILOT_QA_OUTPUT` overrides). Set `CHROMIUM_PATH` to reuse an installed browser instead of downloading one.

## Evidence

### Verified locally (this repository)

- SQL policies and RPCs from the current migration, executed in PGlite with stubbed `auth.users`, `auth.uid()`, and `storage.objects`: membership, invitation hashing and replay, owner-written travel details visible to owner plus organizer, personal versus shared checklists, capacity accounting, revocation, and bucket path fences. The original suite also exercises the forward photo-policy upgrade from owner-only deletion and safe reapplication.
- The eight-person suite's "race" uses `Promise.all` over a single PGlite connection. PGlite **serializes** statement execution, so this proves the RPC's accounting under back-to-back submissions, not simultaneous sessions.
- Sample model and static render behaviour for all eight fictional views; browser QA when run against a local dev server.

### Required hosted evidence (not provided here)

- **Auth:** eight real verified accounts plus an unconfirmed and an anonymous account against Supabase Auth; confirm `palau_private.is_verified()` behaves with real JWT claims and session refresh.
- **PostgREST:** the same RLS matrix through the REST API with each account's access token, including column-level update grants and the `palau_*` RPC wrappers.
- **Storage:** real uploads, signed URLs (60 seconds), and deletes against the non-public `palau-private` bucket, including the organizer moderation path and the anon fence.
- **Concurrency:** eight genuinely simultaneous `palau_set_rsvp` calls from separate sessions against a four-seat activity; the `for update` row lock is the mechanism, and only a hosted run demonstrates it.
- **Revocation latency:** confirm an already-open session loses access on its next request after `palau_revoke_member`.

Until the hosted matrix is recorded, treat the private routes as unreviewed.

### Dependency and lint triage

Compatible lockfile updates cover React Router, Vite, DOMPurify, tar and affected transitive dependencies. The readiness audit dropped from 28 findings (including one critical) to six: four high and two moderate, all in the `@vercel/node` development-tool chain (`@fastify/busboy`, `@vercel/static-config`, `ajv`, `path-to-regexp`, `undici`). These counts include dependency propagation and do not establish six exploitable application paths. The audit proposes a breaking downgrade to `@vercel/node` 4; that change is deferred for separate toolchain review. Do not use `npm audit fix --force` blindly.

Pilot-focused lint is clean. Full-repository lint has a legacy baseline of 28 errors and 12 warnings, primarily render-time randomness, state updates in effects, hook dependencies, and minor unused-variable/constant declarations. Those routes need their own cleanup before claiming repository-wide readiness.

## Limitations

- The build strips legacy browser-side print-provider keys even if inherited deployment variables still define them. Physical print/postcard delivery stays unavailable until a secure server integration exists; PDF export is unaffected.
- Access revalidation deliberately clears unsaved form drafts on focus/session changes. Save before switching tabs.
- Workspace loads recheck identity, role and membership after fetching data and discard results if access changed. Checklist/status updates and journal deletion require one confirmed affected row; an RLS no-op is reported as unavailable, not saved.
- Revoking a member also invalidates all outstanding trip invitations. Reissue invitations as needed; there is no self-service membership restoration or organizer transfer in this pilot.
- Arrival and departure fields are always Palau local time (UTC+9), independent of the browser timezone. Journal attachment removal happens before row deletion; a storage failure keeps the entry for retry.
- The RLS suites run in PGlite with a stubbed `auth` schema. Supabase Auth, PostgREST, Storage uploads, signed URLs, and session handling are not exercised end-to-end here and are not claimed to be validated.
- The sample role selector and static tests are not evidence of deployed privacy. Treat the private routes as unreviewed until the migration and a staging test matrix have been approved in your own environment.
- The private workspace does not request device geolocation, take payments, or create supplier bookings. Uploaded photos retain their original metadata, which can include location; remove sensitive metadata before uploading. "Confirmed" is a group plan status only.
- Do not enter passports, medical details, payment data, or access codes into any pilot surface.
