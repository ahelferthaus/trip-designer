# General trip foundation: review and approval boundary

> Current status, 2026-10-31: the approved foundation and exact lock correction are applied and catalog-verified in isolated staging. All nine independent-connection PostgreSQL 17.11 scenarios passed with the correction. Earlier blocked/unapplied notes below are historical. Both real test-account confirmations succeeded; the deployed tokenless account screen has user-supplied rendered confirmation. General foundation activation still awaits real-session onboarding/access, recovery, revocation/expiry and approved deletion gates. See FOUNDATION_GATE_STATUS.md.

Status: implemented on the pilot branch; **migration applied to the approved isolated staging project on 2026-10-31; frontend remains disabled and unreleased**. This is trip setup and membership infrastructure, not the full legacy feature integration.

## Implemented

- `/pilot/trips`: verified-account dashboard listing only active memberships, each with its own organizer/traveler role; explicit Create a trip and Join an invited trip paths.
- Destination-neutral title, destination, dates, IANA timezone and total participant limit (1–100, default 8 including organizer). This limit is separate from each activity's capacity and is immutable through browser APIs in this version.
- Atomic server-authorized trip creation with creator membership. No caller-selected owner or role. An expected-account parameter must equal auth.uid(); it only rejects session switches and cannot grant ownership. Same-account/same-request retries return the same trip; changed details under that request fail.
- Session-change invalidation and revalidation of dashboard identity/membership. Missing migration produces a safe unavailable state rather than leaking data.
- Trip timezone display; existing Palau local-time inputs unchanged. Other destinations explicitly edit UTC, avoiding untested daylight-saving wall-time conversion. Destination-local editing is a later UX improvement.
- No automatic email invitations. Existing organizer copy-link controls remain the invitation mechanism.

## Approved migration scope

File: `supabase/migrations/20261031071157_general_trip_foundation.sql`.

Apply this exact new SQL file only to the existing isolated staging project after review, never automatically from CI. Inspect existing migration history first; do not run a blanket database push or rerun earlier migrations:

1. Add `destination` and nullable `participant_limit` to `public.palau_trips`. Existing rows keep empty destination and NULL participant limit; no existing membership is revoked or deleted. Existing Palau timezone values remain.
2. Replace the Palau-only timezone CHECK with a bounded string CHECK. The new create RPC validates a region timezone against PostgreSQL's timezone catalog (or UTC), rejects abbreviations and posix/right prefixes. Existing clients still cannot update timezone directly.
3. Create private RLS-enabled `palau_private.trip_creation_requests`, with no browser table privileges, to hold normalized request inputs and the resulting trip ID.
4. Add public INVOKER `vybr_create_trip(uuid,text,text,date,date,text,integer,text,uuid)` and private DEFINER `create_general_trip` with empty search paths and explicit authenticated-only execution. The private function verifies confirmed, nonanonymous `auth.uid()`, validates inputs, then inserts trip and organizer membership in one transaction. This expands supported creation to any verified account, without granting that account authority over another trip.
5. Add a private trigger that serializes active membership inserts/restores on the parent trip, enforcing the configured participant limit. Existing trip limits stay NULL and retain previous behavior. New limited trips cannot exceed their cap via invitation acceptance or restoration. Role/identity mutation grants are unchanged. Activity RSVP capacity stays independent.

No changes to Auth configuration, Auth rows, storage policies, real-account roles, secrets, legacy tables or production settings. No migration or backfill of existing private trip content. The old creation RPC remains compatible and uses its existing unspecified-limit behavior; 100 is a limit for this new creation flow, not a retroactive platform-wide limit.

## Gating and release sequence

`VITE_VYBR_TRIP_FOUNDATION_ENABLED=false` is the documented default. No hosted setting has been changed. With the flag off, the new dashboard route is not mounted, sign-in retains the invited-trip destination, and new schema queries/RPC calls cannot run through this feature. Client helpers also refuse calls while disabled. The flag is a rollout control, not an authorization boundary; database checks enforce access.

The exact revised migration is now applied and catalog-verified. Activation is conditionally approved only after independent-connection concurrency and hosted onboarding/access tests pass. Those conditions remain unmet. Do not deploy this branch as the separate live site yet.

## Evidence and remaining gaps

Local PGlite tests exercise real SQL/RLS under synthetic auth claims, including caller ownership, cross-trip denial, role immutability, invalid inputs, idempotency, atomic rollback, full-trip invitation failure without consuming the invitation, restore limits, per-trip roles and legacy compatibility. Client tests cover disabled gating, unverified/anonymous users, stale identity/membership results, missing migration, safe RPC arguments, retry identity and timezone handling.

PGlite execution is serialized. Subsequent native PostgreSQL 17.11 tests verified independent-connection blocking and persisted outcomes for normal creation/accept/restore races, but reproduced a composed-transaction lock-upgrade deadlock. See [the lock review and proposed correction](PARTICIPANT_LOCK_REVIEW.md). No claim of eight simultaneous HTTP sessions is made. Browser/mobile/keyboard testing remains pending because computer-use URL enforcement is unresolved. Real signup/recovery/invitation redemption is not completed by database tests.

Creation retries keep fields fixed after an uncertain submission; definitive SQL input-validation rejection unlocks editing. Submitted request state survives a temporarily unavailable dashboard in memory, is shown only after the same account is verified, and is cleared on account change/sign-out. Reloading or losing the page loses the in-memory request ID: users must check My trips before starting a fresh request. Creation quotas/rate limiting and trip archival are future public-scale controls; no global organizer role or new service credential is introduced here.

New trips start with empty coordination/activity data. Generic itinerary authoring/AI generation, maps, tracking, photo collections/books/postcards and printing remain separate integration work described in PLATFORM_SCOPE_AND_INTEGRATION.md. Do not advertise them as enabled by this foundation.

Security design follows the [Supabase database function guidance](https://supabase.com/docs/guides/database/functions): restricted execution and empty search paths for privileged code. Before hosted activation, check the deployed PostgreSQL timezone-data version against the [Supabase changelog](https://supabase.com/changelog.md); no database upgrade is authorized or performed by this change.

Migration execution must use the transactional migration runner. Administrative deletion of a newly created trip currently cascades its idempotency ledger entry; any future trip-deletion feature must define tombstone/retry behavior before release. No trip-deletion API is added here.

See [rollout and non-destructive rollback review](GENERAL_TRIP_ROLLOUT.md) before applying or activating the foundation. In particular, the UI flag does not revoke direct creation RPC access.

The 2026-10-31 attempt to run independent local connections was blocked by incomplete native PostgreSQL and an unresponsive Docker engine; see the rollout review for exact evidence. These concurrency checks remain unrun.

The revised unapplied cap trigger now explicitly requires READ COMMITTED for limited-trip membership changes and rejects other modes with SQLSTATE 25000; legacy NULL-limit trips are unaffected. This changes the migration hash, so use the revised hash in the rollout review for approval. The guard tests do not replace independent-connection concurrency tests.
