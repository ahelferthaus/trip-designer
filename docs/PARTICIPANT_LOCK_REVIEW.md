# Participant concurrency review

> Current status, 2026-10-31: the approved foundation and exact lock correction are applied and catalog-verified in isolated staging. All nine independent-connection PostgreSQL 17.11 scenarios passed with the correction. Earlier blocked/unapplied notes below are historical. Both real test-account confirmations succeeded; the deployed tokenless account screen has user-supplied rendered confirmation. General foundation activation still awaits real-session onboarding/access, recovery, revocation/expiry and approved deletion gates. See FOUNDATION_GATE_STATUS.md.

## Real PostgreSQL evidence

The opt-in `scripts/test-postgres-concurrency.mjs` runner uses PostgreSQL 17.11 with independent `psql` connections and an observer checking `pg_blocking_pids`. It creates a synthetic-only loopback cluster, removes its temporary initialization password file, and stops the server after testing. No hosted URL or credentials are accepted. It is not an Auth/HTTP test.

The approved migration passes concurrent duplicate creation, first-creator rollback, conflicting request reuse, wrong expected-account rejection, per-user ownership, final-seat acceptance, simultaneous restoration and mixed accept/restore in both orders. Tests assert persisted counts, ownership and unconsumed losing invitations, not just returned success messages.

An additional composed-transaction case reproduces a deadlock: both transactions first hold `FOR KEY SHARE` on the same parent trip, then restore different members. The trigger attempts `FOR UPDATE`, causing incompatible lock upgrades. PostgreSQL aborts one transaction and the participant cap stays intact. This is an availability/retry defect, not observed overbooking or cross-trip access. The ordinary exposed RPC races above passed; the composed case is broader transaction behavior.

## Proposed correction — not applied to staging

In `palau_private.enforce_participant_limit()` change only:

```sql
select participant_limit into v_limit from public.palau_trips where id=new.trip_id for update;
```

to:

```sql
select participant_limit into v_limit from public.palau_trips where id=new.trip_id for no key update;
```

Retain SECURITY DEFINER, VOLATILE, empty search path, READ COMMITTED guard, NULL-limit compatibility, post-lock count and all grants/trigger bindings. This lock still serializes competing limit checks while remaining compatible with parent KEY SHARE locks. The approved original migration file must remain unchanged; a separately approved forward replacement is required for staging.

The CLI-created draft forward file is `supabase/migrations/20261031133442_participant_limit_lock_compatibility.sql`. It replaces only that function and preserves existing grants. `POSTGRES_TEST_LOCK_CANDIDATE=true` applies this draft only to a fresh LOCAL synthetic cluster. It never edits the original migration or connects to staging. The equivalent one-statement local candidate passed all nine scenarios, including removal of the reproduced deadlock with capacity still enforced. The runner now consumes the draft file directly for reproducibility.

The exact forward file subsequently passed all nine native scenarios as well. Its canonical LF SHA256 is `8742570fdf8fd3182765512672459185e5249b96bd44489d244809499b253312`. All 93 serialized policy/client regressions also pass with this forward file applied locally. The native results are separate from CI and from hosted Auth coverage. The synthetic server was stopped after the final run.

To reproduce on Windows after approving/providing the runtime, set `POSTGRES_TEST_BIN` to its `pgsql/bin` directory and run `node scripts/test-postgres-concurrency.mjs`. Baseline mode intentionally reproduces the lock-upgrade defect. Set `POSTGRES_TEST_LOCK_CANDIDATE=true` to test the draft correction. Do not run either against a real database: the runner always initializes its own local synthetic cluster.

## Reviewer scope and release boundary

Claude Opus 5.5 (`claude-opus-5-5`, confirmed by CLI usage) reviewed the specifically approved workspace/access source files and foundation migration. It identified the lock-upgrade concern and further journey release checks. It did not review the newly written journey source or this runner; those files were not added to the disclosure payload.

Catalog checks confirmed that staging's privileged helpers are owned by a role with BYPASSRLS, relevant tables do not FORCE RLS, and browser roles cannot directly update participant limits/timezones. The original approved migration remains applied; no hosted correction or frontend activation occurred during the local review.

Journey timezone/date handling was tightened based on the review. Its explicit projection already excludes personal travel fields, and flag-off builds omit the implementation. Remaining journey release work includes completeness/pagination, flexible/cancelled plan semantics, upload-time labels, media/session behavior and metadata disclosure. It remains disabled and is not represented as a complete maps or GPS integration.
