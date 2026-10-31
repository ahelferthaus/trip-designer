# Shared journey integration — unreleased

Palau is one trip on the shared VYBR platform. The first reusable journey layer combines already-authorized activity plans and journal memories into a chronological, trip-timezone timeline with private photos. It is behind `VITE_VYBR_JOURNEY_ENABLED=false` and is not deployed.

The adapter explicitly selects shared fields, rejects cross-trip rows and malformed timestamps/media paths, and never projects personal travel details or checklists. Photo access uses the existing verified membership/Storage path and short-lived URLs in component memory; errors offer an explicit retry, with no automatic retry loop. This does not change database permissions or collect location.

## What this slice does not claim

- Planned activities are labelled as plans, not visited locations or GPS tracks.
- No maps, geocoding, GPS capture, offline queue or legacy public photo import is enabled.
- Existing journal attachment limits and ownership rules remain; this is not yet a multi-photo album editor.
- Unit coverage and builds do not establish real hosted photo/session behavior. A reviewed release and supported browser testing are still required.

## Next coherent slices

1. Finish the account/trip activation gates before exposing general creation.
2. Reuse legacy map presentation behind a private activity/location adapter. Add validated coordinates only through reviewed schema/RLS changes; no automatic third-party geocoding of private locations. Explain provider disclosure before optional map loading.
3. Add explicit opt-in recording, stop/logout handling, durable write-error recovery and a reviewed retention model before GPS tracking. Browser foreground capture must not be marketed as reliable native background tracking.
4. Build multi-photo collections against private storage, then adapt digital book/PDF and movie generation. Keep provider billing keys server-side; physical print/postcard delivery is a separate tested service.

For this first trip, the private coordination workspace and a tested shared memory timeline are realistic. Native-quality offline/background tracking, automatic photo geotagging, physical fulfillment and subscriptions remain later releases.

## Candidate after foundation activation

The unreleased journey view now has Plans and memories, Memories, Photos, and Planned stops filters. The stop view is an ordered text route outline, explicitly not a geographic map or GPS track. No external map requests, geocoding, coordinates or new database fields are introduced. The legacy Mapbox implementation is not imported because its provider requests and coordinate persistence require a separate consent and schema review.

Private photo previews use a cancellable in-memory lease, measured from request start, removed after 55 seconds against the existing 60-second signed URL lifetime. Explicit reload asks Storage to check access again. Late responses after expiry/navigation are ignored; account/trip remounts and client/path identity checks prevent stale display. This cannot revoke bytes already downloaded or screenshots. Reload/filtering may request a fresh signed URL; there is no background refresh loop or persistent browser photo cache written by this feature.

Validation includes projection/filter/privacy cases, cancellation and late-response races, expiry, failed access and explicit retry, static React rendering, plus local synthetic UI checks. This is not new hosted journey/photo verification. The existing hosted storage tests cover the underlying membership boundary, not this new UI's full lifecycle.

## First trip release boundary

- Live foundation: verified signup/recovery, create any trip with a participant limit, per-trip organizer/traveler roles, recipient-bound one-use invitation links.
- Existing workspace: itinerary display, activity RSVP/capacity, personal/shared checklists, private travel details and shared journal attachments.
- Invitations currently generate a link for the organizer to copy and send. They do not send invitation email automatically. Authentication confirmation/recovery email delivery is a separate capability.
- Proposed next deployment: enable ONLY this journey view (timeline, photo filter/reload, planned-stop outline), after review and hosted synthetic checks. No moderation, GPS or geographic map activation; no new permissions/schema/providers.
- Before a real Palau trip: owner supplies/approves destination, dates, time zone, participant count and intended itinerary/activities; real content goes only to the private backend, never sample seed or public source. Recipient addresses are entered privately by the organizer. An alternate test identity's use of a participant seat must be explicit.
- Geographic maps need reviewed coordinate schema/authorization and a choice of provider/offline map approach, including disclosure/consent before sending private places. No credentials or location permission needed for the current slice.
- Books, postcards, multi-photo albums and background/offline GPS remain later integration candidates, not rejected product goals.

Legacy tracking remains excluded: its writer currently ignores Supabase returned errors and can clear pending points during a restart. Safe integration needs serialized/idempotent persistence, retry/stop UX and retention/consent together; patching only the returned-error check would still falsely imply durable recording. Do not enable it for the first trip on this evidence.

Opus 5.5 reviewed the generic design only (no additional source disclosure). Its relevant timing finding led to response-time deadline checks and expiry checks on focus/visibility/page restoration, without refetching. Existing uploaded originals can contain EXIF/location metadata; the current upload warning remains, and this release does not claim metadata stripping, cache erasure, or recall of previously downloaded bytes. Re-encoded derivatives and comprehensive cache/metadata policy are separate hardening work. Generic review is not source review or production certification.
