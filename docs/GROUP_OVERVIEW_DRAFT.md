# Group operations overview — design draft, not deployed

## Existing versus new
Existing workspace exposes group arrival windows/hand-off notes and authorized activity RSVP responses. Exact flight arrival/departure times and lodging references are in private traveler records. They must NOT be repurposed as group data. No room/cabin assignment model exists.

New reusable presentation: `GroupTripOverview`, a chronological comparison chart, desktop roster table and responsive traveler cards. Includes event-local time zones; confirmed/tentative/not-provided states; transfer groups; multiple land stays with calendar-night counts; solo/shared/unassigned rooms; cabin and explicitly provided roommate names; explicit activity responses. No medical, dive-certification, passport, payment or private booking-reference fields. Timelines show planned intervals, not live location. Missing/withheld fields have the same presentation. These DTOs are not authorization mechanisms.

## Draft backend contract (no SQL/grants applied)
- Require verified active per-trip membership before any read; remove data on account/trip change or membership revocation. Project only fields explicitly shared to the group on the server.
- A participant-owned operational plan stores optional shared arrival/departure instants with IANA event zones, transfer-group choice and status. Sharing is explicit and reversible per section; never copy private travel rows automatically. Store confirmation actor/time/version so “confirmed” means confirmed by whom, not an operator booking guarantee.
- Accommodation segments: trip, participant, land/boat kind, local start/end dates, assignment label, solo/shared/unassigned, status. Multiple segments allow hotel and cabin changes. Organizer assignment proposals stay tentative until the traveler accepts. Solo is not a payment status.
- Roommate names are separately authorized shared references, not unconstrained free text: each named person's permission is required, otherwise show “roommate not shared”. Prevent cross-trip links and stale/withdrawn disclosure. Do not infer partners from matching cabin/room labels or names.
- Group-visible activity responses may reuse the existing authorized RSVP source only with the intended sharing policy. “Not going”, “maybe”, and missing response remain distinct. No qualification or medical inference.
- Organizer-only coordination notes belong in a separate organizer-scoped table/projection, never in the group DTO. No organizer blanket access to traveler-private fields is implied.
- A person/participant and an auth account are different concepts. If one person uses organizer and traveler accounts, require an explicit reviewed linkage/role policy. Current account membership limit is unchanged; never silently merge identities or allocate a ninth seat.
- Test active/revoked/nonmember, cross-trip links, sharing withdrawal, same-name people, partial sections, confirmation conflicts, invitation capacity, account switches and cache cleanup before migration/release approval.

## Seven-friend preview
`GroupOverviewPreview` is isolated and defaults off (`VITE_VYBR_GROUP_OVERVIEW_PREVIEW=false`). With exactly one authorized first-traveler shared plan and a valid window, its button creates seven clearly named sample friends in component memory only. Remove-all is one reversible action; the original DTO is untouched and is restored. Samples never enter Auth, membership, capacity, storage, invitations, recipients or notifications. The wrapper exposes no persistence or network client. Active sample output is omitted when printing; screenshots remain visibly labeled. Trip/account changes reset the overlay. No user email is hardcoded. Current local fixture's first profile is ALSO synthetic; no real profile has been populated.

Integration must wait until the intended first traveler fills and explicitly shares their profile. Caller provides the verified traveler ID; it must not guess from email. The real organizer/traveler physical-person relationship needs a product decision before roster population, not a silent membership policy change.

## Review and validation
Opus 5.5 reviewed generic design only. Relevant findings included per-person consent for roommate disclosure, no inference from withheld fields, explicit tentative timeline labels and accessible sample-state announcements. Source/render tests cover time zones, invalid times, calendar nights, partial timelines, private/cross-trip exclusion, HTML escaping, sample count/identity and input immutability. Browser visual/mobile verification is pending: initial loopback preview timed out, server was recovered and HTTP 200 verified, but the browser subsequently rejected navigation from its generated error-page URL. No alternate browser path was used to bypass that block.

No UI-specific project skill was available; the repository's itinerary generation/theme/refinement skills are not applicable to this component work. Existing private workspace palette and typography informed the design.

## Docker
No tracked Dockerfile/compose configuration or deployment dependency was found. The deployed separate app is static Vercel output backed by hosted Supabase. Local tests use Node and previously the standalone PostgreSQL test runtime. Docker was only an earlier attempted local test option; historical Docker Desktop process cleanup was not confirmed, which does not make it an application requirement.

## Remaining narrow decisions
Before real population: confirm first traveler versus organizer account/person semantics, the authorized shared operational sections, and actual travel/stay/cabin details (missing values may remain not provided). Before release: approve the reviewed schema/access changes and separate UI deployment; no current change is live. The seven samples need no real recipient list and will never receive invitations. Invitations remain recipient-bound copy-links for the organizer to send, not automatic invitation email.
