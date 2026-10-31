# General trip foundation rollout and rollback

> Current status, 2026-10-31: the approved foundation and exact lock correction are applied and catalog-verified in isolated staging. All nine independent-connection PostgreSQL 17.11 scenarios passed with the correction. Earlier blocked/unapplied notes below are historical. Both real test-account confirmations succeeded; the deployed tokenless account screen has user-supplied rendered confirmation. General foundation activation still awaits real-session onboarding/access, recovery, revocation/expiry and approved deletion gates. See FOUNDATION_GATE_STATUS.md.

This is an operational review, not approval to execute hosted changes. The reviewed migration is `20261031071157_general_trip_foundation.sql`; its revised Git-blob SHA256 (LF line endings) is `4441CA695DECFC384CEA6EADD2F83175A95E2F4B700583589860D2233A2FACF8`. The equivalent Windows working copy with CRLF has SHA256 `D80DFAEAFF85C47A27C9952E52E213863507C4AE374FF2A0A2D4F2B26838E03C`. This supersedes the earlier Windows foundation hash `2B524D904349AEDB01CADED6779A781087440FD6EB180794ED4125B65C4EFD99`: the draft now explicitly rejects unsupported transaction isolation for limited-trip membership changes. Approval must name this revised file.

## Before an approved staging apply

- Confirm the exact staging target, current migration history, and reviewed file hash. Earlier local migration filenames do not necessarily match recorded staging versions. Apply only this new file with a transactional migration runner; never run a blanket database push or replay the initial pilot migration.
- Check that `palau_trips_time_zone_check` is the existing Palau-only CHECK, the new columns/table/functions/trigger do not already exist, and authenticated retains USAGE on `palau_private`. An unexpected partial or already-applied state requires inspection, not a retry.
- Verify existing dependencies: `palau_private.is_verified()` returns a non-null boolean for missing, anonymous and unconfirmed identities; `palau_private.is_organizer(uuid)` exists; `palau_members` has NOT NULL trip/user IDs and the expected role, display_name and revoked_at columns. The reviewed base migration provides these; inspect hosted definitions for drift.
- Inspect all existing `palau_members` triggers and confirm there is no conflicting role-assignment or lock-order behavior. Confirm authenticated has column-level UPDATE grants only on trips, not table-level UPDATE that would implicitly expose new columns.
- Inventory partial state before any uncertain retry: destination/participant_limit columns, old/new timezone constraints, private request table, both creation functions, participant-limit trigger function and trigger, and their grants. A successful transactional runner should leave all or none of these changes.
- Keep `VITE_VYBR_TRIP_FOUNDATION_ENABLED=false`. Preserve the currently released artifact for application rollback. Do not export private rows into the repository or logs.
- Establish a recovery point using an approved recovery mechanism before schema changes (availability remains unverified); this review does not authorize a new paid backup service or copying private data elsewhere.

## After apply, before enabling the UI

Verify migration history and actual catalog state: new private table has RLS and no browser table grants; exposed create wrapper is INVOKER; privileged helper has an empty search path, checks verified identity and expected account; anon/PUBLIC cannot execute either function; authenticated has only the intended execute grants. Existing membership-role/timezone/participant-limit direct mutation grants remain absent. Run Supabase advisors and distinguish baseline findings from this migration's changes.

A frontend flag is not an API permission gate. Applying the migration grants verified authenticated callers access to the new RPC even before the dashboard is enabled. Its SQL authorization must therefore stand alone. Scope approval must include those execution grants.

Exercise synthetic creation, same-request retry, wrong-account rejection, cross-trip denial, final participant slot, revoked-member restore and legacy-trip compatibility. Genuine concurrent tests need separate PostgreSQL connections with READ COMMITTED isolation, observable blocking before the winning transaction commits, and persisted counts/roles checked afterward. PGlite's serialized tests do not satisfy that requirement. Auth/browser tests additionally require supported user sessions; SQL tests are not real Auth HTTP tests.

Use a supported single-file migration operation that records migration history and runs the reviewed SQL in one transaction. If that operation is unavailable, stop and agree a precise application/history procedure; do not improvise a blanket CLI push.

Only after those checks and separate activation approval should the isolated site be rebuilt with the flag true. No original production routing, real roles, invitations, private imports or legacy providers are part of activation.

## Prefer a non-destructive rollback

1. Return the isolated application to its previous approved artifact / flag-off release. This hides the new journey but does **not** disable direct RPC calls.
2. If new creation must also stop, separately authorize and execute both revocations below in the affected staging database. Revoking only the wrapper is insufficient because authenticated can execute the internal helper through database SQL. These are proposed emergency actions, not executed changes:

```sql
revoke execute on function public.vybr_create_trip(uuid,text,text,date,date,text,integer,text,uuid) from authenticated;
revoke execute on function palau_private.create_general_trip(uuid,text,text,date,date,text,integer,text,uuid) from authenticated;
```

3. Preserve trip rows, organizer memberships, new metadata, private media and idempotency records. Keep the participant-limit trigger for already-created limited trips. Dropping it would silently remove their cap; dropping columns or the ledger would destroy metadata or safe-retry history.
4. Do not restore the old Palau-only timezone CHECK while non-Palau trips exist. It would fail validation or prevent legitimate updates. Use a separately reviewed forward repair rather than a destructive down migration.
5. If the cap trigger itself is defective, investigate the exact lock/error evidence and propose a scoped repair. Do not silently remove enforcement to restore availability. Existing activity RSVP limits are separate and should remain unchanged.

Revocations do not change stored roles or delete trips. Re-enabling execution later requires explicit approval and validation of the repaired version. Any administrative trip deletion also deletes that trip's idempotency record under the current FK; future deletion/archive support must define tombstone behavior before it is exposed.

## Original review boundary (before approval)

No hosted SQL, configuration, permission revocation, role change, application rollback or activation was performed during this review. The forward migration remains unapplied. Local concurrency evidence is recorded separately; lack of a functioning local server must be reported rather than substituting sequential or mocked results.

## Local independent-connection test attempt — 2026-10-31

No real concurrent result was obtained. Specifically:

- Windows PostgreSQL 16 has an incomplete installation under `C:\Program Files\PostgreSQL\16`: support utilities are present, but `bin\postgres.exe` and `bin\psql.exe` are absent. There was no running native PostgreSQL process observed.
- The existing Ubuntu WSL distribution has neither executable on PATH and no matching server/client binaries under `/usr/lib/postgresql/*/bin`.
- Docker Desktop was installed but initially stopped: the `dockerDesktopLinuxEngine` named pipe did not exist. Starting the existing desktop application was attempted without installation or settings changes. A subsequent bounded Docker server-version query timed out after 12 seconds. The server version and cached PostgreSQL image availability could not be determined.
- No image was downloaded, no container or native database was created, and no hosted database/security setting was accessed or changed for this attempt.

Concurrent idempotent creation, expected-account/ownership races, final-slot invitation acceptance, and restore contention are all **UNRUN on independent PostgreSQL connections**. Prior PGlite tests remain serialized evidence only. The next prerequisite is a healthy existing Docker engine with a PostgreSQL image, or a usable native/local PostgreSQL server; repairing/installing one is not performed by this review.

The revised trigger checks `current_setting('transaction_isolation')` for limited trips and raises SQLSTATE 25000 unless it is READ COMMITTED; legacy NULL-limit trips return before this guard. Local regression tests verify rejection and rollback at REPEATABLE READ/SERIALIZABLE, then successful retry at READ COMMITTED. This is a mode-guard test, **not** proof of concurrent locking. The snapshot requirement follows [PostgreSQL transaction-isolation documentation](https://www.postgresql.org/docs/16/transaction-iso.html).

Docker cleanup: the supported graceful stop command (`docker desktop stop --timeout 15`) reported failure, and desktop/backend processes remained afterward. No force-stop or runtime settings changes were attempted; restoring Docker to its initially stopped state remains unconfirmed.

The trigger is explicitly VOLATILE to preserve statement-snapshot behavior. The concurrency property relies on documented READ COMMITTED semantics and has not yet been exercised using independent connections. The new columns remain absent from browser UPDATE grants in the reviewed base schema; hosted catalog drift must still be checked before apply.

## Approved staging application — 2026-10-31

The user approved the exact revised migration and conditional frontend activation. Canonical hash was verified against the approved value above. The single-file migration succeeded on the existing isolated staging project and appears in its migration history. Preflight found no partial application or conflicting membership trigger, and confirmed the old Palau-only timezone check and expected column-level grants.

Postflight confirmed the private ledger has RLS/no browser table grants; the public wrapper is INVOKER; privileged helpers have empty search paths; anon has no execution permission; and browser UPDATE on timezone, destination and participant limit remains denied. The two preexisting trips retain NULL participant limits and unchanged membership behavior. No real account roles, Auth settings or production settings were changed.

Local tests passed 93/93. A hosted rollback-only SQL policy smoke test passed creation ownership, same-request idempotency, expected-account rejection, one-use invitations, cross-trip denial, final capacity, revoke/accept and restore capacity. These use existing fictional identities as SQL claims, not real browser Auth sessions. An initial test incorrectly expected reuse of an accepted one-use invitation; the corrected test expects and verifies rejection. The failed transaction was rolled back.

The supported connector did not provide observable overlapping transactions during a bounded contention attempt: the observer found no active test transaction. That attempt proves only serialized retry behavior, not concurrency. One synthetic trip/request remains preserved from that attempt; no cleanup was performed. Docker's engine pipe remains unavailable after a bounded launch/status check, so local independent-connection testing is still blocked. No software installation or runtime security change was made.

Advisors show expected RLS-without-policy notices on the two private internal tables (no browser grants), and the preexisting leaked-password-protection warning. A backup restore point was not independently verified; the approved change used the supported transactional migration operation and the non-destructive rollback design above. Activation remains blocked on genuine concurrency and hosted onboarding/access evidence; the frontend flag and separate live artifact remain unchanged.

Performance advisors also identify an unindexed `trip_creation_requests.trip_id` foreign key introduced by this migration, plus four other unindexed foreign keys and 15 existing per-row Auth RLS evaluations. These are performance findings, not permission failures. The new ledger index should be a separately reviewed forward change; the approved migration was not silently expanded.

## Native runtime and Opus review follow-up

With explicit approval, PostgreSQL 17.11 binaries were obtained from the EDB distribution linked by postgresql.org and extracted locally. The Windows archive SHA256 is `80379B2C04D51C30225532E0AE04509899141E9957ED096FE749D7FD9DF8F82F`. The four core executables are not Authenticode-signed; provenance is the official HTTPS download chain, not a signature claim. No Windows service, PATH/firewall change or Docker security change was made. Only synthetic clusters, loopback binding and ephemeral local authentication were used; servers are stopped after tests and clusters preserved.

Independent PostgreSQL connections now prove normal creation/acceptance/restore serialization, including rollback and mixed operations. They also reproduced a composed-transaction lock-upgrade deadlock. A local correction passes that case while preserving the participant cap. The [review and draft forward correction](PARTICIPANT_LOCK_REVIEW.md) are a new approval boundary; staging still has the original approved function. Do not enable the foundation until the correction is separately approved/applied/verified and hosted onboarding/access checks pass.

Claude Opus 5.5 completed the explicitly authorized three-file review. Further journey source was not disclosed. Its timezone/date concerns were addressed in the disabled adapter; remaining journey release checks are documented separately. Browser target-identification restrictions were not bypassed, and no real emails, invitations, roles or production changes were performed.
