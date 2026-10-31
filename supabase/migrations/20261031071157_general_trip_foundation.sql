-- REVIEW DRAFT: local tests only; do not apply to a hosted project without approval.
-- General creation reuses the private workspace and preserves all existing RLS.
alter table public.palau_trips add column destination text not null default '' check(length(destination)<=160);
alter table public.palau_trips add column participant_limit integer check(participant_limit between 1 and 100);
alter table public.palau_trips drop constraint palau_trips_time_zone_check;
alter table public.palau_trips add constraint palau_trips_time_zone_length check(length(time_zone) between 1 and 100);

create table palau_private.trip_creation_requests (
 user_id uuid not null references auth.users on delete cascade,
 request_id uuid not null, trip_id uuid references public.palau_trips on delete cascade,
 input jsonb not null, primary key(user_id,request_id)
);
alter table palau_private.trip_creation_requests enable row level security;
revoke all on palau_private.trip_creation_requests from public,anon,authenticated;

create function palau_private.create_general_trip(p_request uuid,p_title text,p_destination text,p_start date,p_end date,p_zone text,p_limit integer,p_name text,p_expected_user uuid)
returns uuid language plpgsql volatile security definer set search_path='' as $$
declare v_trip uuid; v_input jsonb; v_existing jsonb;
begin
 if p_expected_user is distinct from auth.uid() then raise exception 'Account changed' using errcode='42501'; end if;
 if not palau_private.is_verified() then raise exception 'Verified sign-in required' using errcode='42501'; end if;
 if p_request is null or p_title is null or length(trim(p_title)) not between 1 and 160
  or p_destination is null or length(trim(p_destination)) not between 1 and 160
  or p_name is null or length(trim(p_name)) not between 1 and 60
  or p_start is null or p_end is null or not isfinite(p_start) or not isfinite(p_end) or p_end<p_start
  or p_zone is null or length(p_zone)>100 or (p_zone<>'UTC' and (p_zone not like '%/%' or p_zone like 'posix/%' or p_zone like 'right/%')) or not exists(select 1 from pg_catalog.pg_timezone_names where name=p_zone)
  or p_limit is null or p_limit not between 1 and 100 then raise exception 'Invalid trip details' using errcode='22023'; end if;
 v_input:=jsonb_build_object('title',trim(p_title),'destination',trim(p_destination),'start',p_start,'end',p_end,'zone',p_zone,'limit',p_limit,'name',trim(p_name));
 -- Unique key serializes a retried request, including simultaneous submissions.
 insert into palau_private.trip_creation_requests(user_id,request_id,input) values(auth.uid(),p_request,v_input) on conflict(user_id,request_id) do nothing;
 select trip_id,input into v_trip,v_existing from palau_private.trip_creation_requests where user_id=auth.uid() and request_id=p_request for update;
 if v_existing is distinct from v_input then raise exception 'Request already used for different trip details'; end if;
 if v_trip is not null then
  if not palau_private.is_organizer(v_trip) then raise exception 'Not authorized' using errcode='42501'; end if;
  return v_trip;
 end if;
 insert into public.palau_trips(title,destination,start_date,end_date,time_zone,participant_limit)
 values(trim(p_title),trim(p_destination),p_start,p_end,p_zone,p_limit) returning id into v_trip;
 insert into public.palau_members(trip_id,user_id,display_name,role) values(v_trip,auth.uid(),trim(p_name),'organizer');
 update palau_private.trip_creation_requests set trip_id=v_trip where user_id=auth.uid() and request_id=p_request;
 return v_trip;
end $$;
revoke all on function palau_private.create_general_trip(uuid,text,text,date,date,text,integer,text,uuid) from public,anon,authenticated;
grant execute on function palau_private.create_general_trip(uuid,text,text,date,date,text,integer,text,uuid) to authenticated;
create function public.vybr_create_trip(p_request uuid,p_title text,p_destination text,p_start date,p_end date,p_zone text,p_limit integer,p_name text,p_expected_user uuid)
returns uuid language sql security invoker set search_path='' as $$
 select palau_private.create_general_trip(p_request,p_title,p_destination,p_start,p_end,p_zone,p_limit,p_name,p_expected_user)
$$;
revoke all on function public.vybr_create_trip(uuid,text,text,date,date,text,integer,text,uuid) from public,anon,authenticated;
grant execute on function public.vybr_create_trip(uuid,text,text,date,date,text,integer,text,uuid) to authenticated;

-- Covers invitation acceptance and organizer restoration without changing role grants.
-- Existing trips have NULL limits and retain their previous membership behavior.
create function palau_private.enforce_participant_limit() returns trigger
language plpgsql security definer set search_path='' as $$
declare v_limit integer; v_count integer;
begin
 if new.revoked_at is not null then return new; end if;
 -- Existing accept/restore paths lock invitation/member first, then the trip.
 -- Do not introduce a trip-then-existing-member lock path in future RPCs.
 select participant_limit into v_limit from public.palau_trips where id=new.trip_id;
 if v_limit is null then return new; end if;
 select participant_limit into v_limit from public.palau_trips where id=new.trip_id for update;
 if v_limit is not null then
  select count(*) into v_count from public.palau_members where trip_id=new.trip_id and revoked_at is null and user_id<>new.user_id;
  if v_count>=v_limit then raise exception 'Trip participant limit reached'; end if;
 end if;
 return new;
end $$;
revoke all on function palau_private.enforce_participant_limit() from public,anon,authenticated;
create trigger palau_participant_limit before insert or update of revoked_at,trip_id,user_id on public.palau_members
for each row execute function palau_private.enforce_participant_limit();
