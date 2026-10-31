-- REVIEW REQUIRED: not approved or applied to hosted staging.
-- Preserve permissions and participant semantics; avoid parent KEY SHARE lock upgrades.
create or replace function palau_private.enforce_participant_limit() returns trigger
language plpgsql volatile security definer set search_path='' as $$
declare v_limit integer; v_count integer;
begin
 if new.revoked_at is not null then return new; end if;
 -- Existing accept/restore paths lock invitation/member first, then the trip.
 -- Do not introduce a trip-then-existing-member lock path in future RPCs.
 select participant_limit into v_limit from public.palau_trips where id=new.trip_id;
 if v_limit is null then return new; end if;
 -- The count after the lock must use a fresh statement snapshot.
 -- Fail closed instead of relying on stale REPEATABLE READ snapshots.
 if current_setting('transaction_isolation')<>'read committed' then
  raise exception 'Participant changes require read committed isolation' using errcode='25000';
 end if;
 select participant_limit into v_limit from public.palau_trips where id=new.trip_id for no key update;
 if v_limit is not null then
  select count(*) into v_count from public.palau_members where trip_id=new.trip_id and revoked_at is null and user_id<>new.user_id;
  if v_count>=v_limit then raise exception 'Trip participant limit reached'; end if;
 end if;
 return new;
end $$;
