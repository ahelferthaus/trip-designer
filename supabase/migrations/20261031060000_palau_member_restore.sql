-- Forward migration: review and approve before applying to any hosted project.
-- Revoke only the target traveler's pending invitations. Restore does not
-- resurrect invitations or old activity reservations.
create or replace function palau_private.revoke_member(p_trip uuid,p_user uuid) returns void
language plpgsql security definer set search_path='' as $$
declare v_email text;
begin
 if not palau_private.is_organizer(p_trip) then raise exception 'Not authorized' using errcode='42501'; end if;
 -- Match set_rsvp's activity lock before changing effective seat membership.
 perform 1 from public.palau_activities where trip_id=p_trip order by id for update;
 select lower(email) into v_email from auth.users where id=p_user;
 -- Lock invitations before membership, like accept_invite.
 perform 1 from palau_private.invitations where trip_id=p_trip and invited_email=v_email and accepted_at is null order by id for update;
 perform 1 from public.palau_members where trip_id=p_trip and user_id=p_user and role='traveler' for update;
 if not found then raise exception 'Traveler unavailable'; end if;
 update public.palau_members set revoked_at=coalesce(revoked_at,now()) where trip_id=p_trip and user_id=p_user;
 update palau_private.invitations set revoked_at=now() where trip_id=p_trip and invited_email=v_email and accepted_at is null and revoked_at is null;
end $$;

create function palau_private.restore_member(p_trip uuid,p_user uuid) returns void
language plpgsql security definer set search_path='' as $$
declare v_revoked timestamptz;
begin
 if not palau_private.is_organizer(p_trip) then raise exception 'Not authorized' using errcode='42501'; end if;
 perform 1 from public.palau_activities where trip_id=p_trip order by id for update;
 select revoked_at into v_revoked from public.palau_members where trip_id=p_trip and user_id=p_user and role='traveler' for update;
 if not found then raise exception 'Traveler unavailable'; end if;
 -- Repeated restore is a no-op; it must not clear new reservations.
 if v_revoked is null then return; end if;
 update public.palau_rsvps set response='not_going',updated_at=now() where trip_id=p_trip and user_id=p_user;
 update public.palau_members set revoked_at=null where trip_id=p_trip and user_id=p_user;
end $$;
create function public.palau_restore_member(p_trip uuid,p_user uuid) returns void
language sql security invoker set search_path='' as $$ select palau_private.restore_member(p_trip,p_user) $$;
revoke all on function palau_private.restore_member(uuid,uuid),public.palau_restore_member(uuid,uuid) from public,anon,authenticated;
grant execute on function palau_private.restore_member(uuid,uuid),public.palau_restore_member(uuid,uuid) to authenticated;

-- Positive absence proof for retries after Storage removal succeeded but the
-- journal row delete failed. Never delete storage.objects directly: blob cleanup
-- remains the Storage API's responsibility. A filtered empty list is not proof.
create function palau_private.journal_media_absent(p_trip uuid,p_entry uuid,p_path text) returns boolean
language plpgsql security definer set search_path='' as $$
declare v_entry public.palau_journal;
begin
 if not exists(select 1 from pg_catalog.pg_roles where rolname=current_user and (rolbypassrls or rolsuper)) then raise exception 'Trusted metadata visibility unavailable' using errcode='42501'; end if;
 if not palau_private.is_member(p_trip) then raise exception 'Not authorized' using errcode='42501'; end if;
 select * into v_entry from public.palau_journal where trip_id=p_trip and id=p_entry;
 if not found or (v_entry.user_id<>auth.uid() and not palau_private.is_organizer(p_trip)) then raise exception 'Not authorized' using errcode='42501'; end if;
 if p_path is null or v_entry.media_path is distinct from p_path or split_part(p_path,'/',1)<>p_trip::text or split_part(p_path,'/',2)<>v_entry.user_id::text then return false; end if;
 return not exists(select 1 from storage.objects where bucket_id='palau-private' and name=p_path);
end $$;
create function public.palau_journal_media_absent(p_trip uuid,p_entry uuid,p_path text) returns boolean
language sql security invoker set search_path='' as $$ select palau_private.journal_media_absent(p_trip,p_entry,p_path) $$;
revoke all on function palau_private.journal_media_absent(uuid,uuid,text),public.palau_journal_media_absent(uuid,uuid,text) from public,anon,authenticated;
grant execute on function palau_private.journal_media_absent(uuid,uuid,text),public.palau_journal_media_absent(uuid,uuid,text) to authenticated;
