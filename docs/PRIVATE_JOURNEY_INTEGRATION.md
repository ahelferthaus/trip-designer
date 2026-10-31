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

## Local coordinate map candidate (disabled)

`PrivateStopMap` is a dependency-free SVG equirectangular coordinate plot with an accessible numbered stop list. It uses only supplied shared coordinates, handles dateline intervals, validates finite latitude/longitude ranges, rejects cross-trip/unshared records, and never joins across unknown stops. It provides no roads, land outlines, distance estimates, GPS collection or geocoding. Projection distortion and planned-only semantics are explicit. It is gated by `VITE_VYBR_STOP_MAP_ENABLED=false`, separately from the journey flag; the disabled build excludes its chunk.

The current private adapter deliberately supplies null coordinates. Activity locations are free text, and neither metadata nor EXIF are treated as consent to publish coordinates. All real stops remain unmapped. Synthetic fixtures exercise the plotting interface. Useful real coordinate placement requires a separately reviewed typed schema, organizer editing, per-trip membership enforcement and explicit sharing choice; no migration is proposed/applied in this slice.

Provider inventory: `src/lib/mapProvider.ts` supports Mapbox/MapTiler and a Google fallback abstraction; `mapboxGeocode.ts` sends a query and optional proximity to the provider; `LiveRouteMap.tsx` imports Mapbox GL and satellite styles. Existing package includes mapbox-gl. The example environment has an empty Mapbox entry; no credentials were read and live provider credentials were not inspected. Provider availability/billing are therefore unverified. Reusing that widget would introduce external requests, so this slice reuses the coordinate conventions instead, without loading it.

Options: (1) local coordinate plot plus manually approved shared coordinates, requiring no provider; (2) an actual basemap with an explicitly chosen provider, authorized public key/domain restrictions and cost limits, clear disclosure before loading private locations; (3) bundled licensed offline basemap data, subject to size/licensing review. No option currently authorizes GPS or geocoding real trip data.

## Photo metadata assessment and proposed policy

The private upload currently validates type/size then stores the original File; it does not strip metadata. Existing `imageUtils.resizeImage`/legacy `tripPhotos` redraw into JPEG but have no metadata verification, pixel limits or object-URL cleanup, so they are not a proven privacy sanitizer.

Recommended new-upload policy: explain that a shared copy will be re-encoded to remove embedded metadata, preserving the user's original on their device; decode locally with pixel/memory limits, normalize orientation, redraw pixels to a fresh supported format, use a random filename, revoke temporary object URLs, and fail closed if processing or verification fails. Test planted EXIF GPS, XMP/IPTC, PNG textual chunks, WebP EXIF, orientation, transparent/animated images and corrupt inputs; explicitly define animation/transparency tradeoffs. Never fall back to uploading the original after a sanitizer error. This should not claim to conceal locations visible in the image itself. An original-quality option, if desired, needs explicit warning/consent and a private retention/access design.

No stored photos were rewritten or removed. Any retroactive conversion needs separate exact scope, backup/retention decisions and approval. No sanitized-upload implementation or metadata-stripping claim is part of this candidate.

Recommended first release remains the live coordination foundation plus reviewed journey/photo views, private real-trip content and organizer-sent recipient-bound links. Geographic basemaps and GPS are not needed to invite this group. Coordinate plotting can follow once approved real coordinate entry exists; exposing an all-unmapped panel adds little value for this trip.

Opus 5.5 generic review identified projection-cut connections and filtering-before-adjacency as risks. The component now suppresses connections for partial input projections, skips zero-length lines, and omits segments crossing 180 degrees of the chosen longitude window. Server-authorized projections remain required; client filters are defense in depth, not authorization. Visible counts and overlap wording avoid implying every numbered marker is separately visible. For any future metadata policy, enforce sanitized-format/version constraints server-side too: older clients or alternate upload paths must not bypass processing. These are design findings, not evidence of metadata sanitation today.
