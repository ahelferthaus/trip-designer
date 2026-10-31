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
