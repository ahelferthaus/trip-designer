-- REVIEW DRAFT. Created by Supabase CLI; never applied to a remote project.
-- Isolated pilot: no legacy trips/members/journal rows or public media URLs.
begin;
create schema if not exists palau_private;
revoke all on schema palau_private from public, anon, authenticated;
grant usage on schema palau_private to authenticated;
alter default privileges in schema palau_private revoke execute on functions from public;

create table public.palau_trips (
 id uuid primary key default gen_random_uuid(), title text not null check(length(title) between 1 and 160),
 start_date date not null, end_date date not null check(end_date >= start_date),
 time_zone text not null default 'Pacific/Palau' check(time_zone = 'Pacific/Palau'),
 coordination jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.palau_members (
 trip_id uuid not null references public.palau_trips on delete cascade,
 user_id uuid not null references auth.users on delete cascade,
 display_name text not null check(length(display_name) between 1 and 60),
 role text not null check(role in ('organizer','traveler')),
 revoked_at timestamptz, primary key(trip_id,user_id)
);
create index palau_members_user_idx on public.palau_members(user_id,trip_id) where revoked_at is null;
create table palau_private.invitations (
 id uuid primary key default gen_random_uuid(), trip_id uuid not null references public.palau_trips on delete cascade,
 invited_email text not null, token_hash bytea unique not null,
 created_by uuid not null references auth.users, expires_at timestamptz not null,
 accepted_at timestamptz, revoked_at timestamptz, created_at timestamptz not null default now()
);
create index palau_invites_trip_idx on palau_private.invitations(trip_id);
create table public.palau_arrivals (
 trip_id uuid not null, user_id uuid not null,
 arrival_window text not null default '' check(length(arrival_window)<=120),
 departure_window text not null default '' check(length(departure_window)<=120),
 handoff_note text not null default '' check(length(handoff_note)<=500),
 transfer_status text not null default 'needed' check(transfer_status in ('needed','coordinating','confirmed','not_needed')),
 primary key(trip_id,user_id), foreign key(trip_id,user_id) references public.palau_members(trip_id,user_id) on delete cascade
);
-- Exact personal travel references are deliberately separate from group-visible
-- arrival windows. RLS exposes a row only to its owner and the trip organizer.
create table public.palau_travel_details (
 trip_id uuid not null, user_id uuid not null,
 arrival_at timestamptz, departure_at timestamptz,
 flight_reference text not null default '' check(length(flight_reference)<=160),
 lodging_reference text not null default '' check(length(lodging_reference)<=240),
 private_note text not null default '' check(length(private_note)<=1000),
 updated_at timestamptz not null default now(),
 primary key(trip_id,user_id), foreign key(trip_id,user_id) references public.palau_members(trip_id,user_id) on delete cascade
);
create table public.palau_checklist (
 id uuid primary key default gen_random_uuid(), trip_id uuid not null,
 owner_id uuid not null, visibility text not null check(visibility in ('personal','shared')),
 title text not null check(length(title) between 1 and 240), done boolean not null default false,
 foreign key(trip_id,owner_id) references public.palau_members(trip_id,user_id) on delete cascade
);
create index palau_checklist_trip_idx on public.palau_checklist(trip_id,owner_id);
create table public.palau_activities (
 id uuid primary key default gen_random_uuid(), trip_id uuid not null references public.palau_trips on delete cascade,
 title text not null check(length(title) between 1 and 160), starts_at timestamptz not null,
 description text not null default '' check(length(description)<=2000),
 location text not null default '' check(length(location)<=240),
 capacity integer check(capacity > 0), estimated_cost numeric(10,2) check(estimated_cost >= 0),
 cost_note text not null default '' check(length(cost_note)<=500),
 currency text not null default 'USD' check(currency='USD'),
 source_label text not null default '' check(length(source_label)<=160),
 source_url text check(source_url is null or (length(source_url)<=2000 and source_url like 'https://%')),
 date_flexible boolean not null default false,
 metadata jsonb not null default '{}' check(jsonb_typeof(metadata)='object'),
 booking_status text not null default 'suggested' check(booking_status in ('suggested','requested','confirmed','cancelled')),
 unique(trip_id,id)
);
create index palau_activities_trip_idx on public.palau_activities(trip_id,starts_at);
create table public.palau_rsvps (
 trip_id uuid not null, activity_id uuid not null, user_id uuid not null,
 response text not null check(response in ('going','maybe','not_going')),
 updated_at timestamptz not null default now(), primary key(activity_id,user_id),
 foreign key(trip_id,activity_id) references public.palau_activities(trip_id,id) on delete cascade,
 foreign key(trip_id,user_id) references public.palau_members(trip_id,user_id) on delete cascade
);
create index palau_rsvps_trip_idx on public.palau_rsvps(trip_id);
create table public.palau_journal (
 id uuid primary key default gen_random_uuid(), trip_id uuid not null, user_id uuid not null,
 body text not null check(length(body) between 1 and 4000),
 media_path text, recorded_at timestamptz not null default now(),
 foreign key(trip_id,user_id) references public.palau_members(trip_id,user_id) on delete cascade,
 check(media_path is null or media_path like trip_id::text || '/' || user_id::text || '/%')
);
create index palau_journal_trip_idx on public.palau_journal(trip_id,recorded_at);

-- Only narrow internal functions bypass RLS, to avoid recursive member policies.
-- Every entry point checks authenticated, non-anonymous, confirmed auth identity.
create function palau_private.is_verified() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from auth.users u where u.id=auth.uid()
  and not coalesce(u.is_anonymous,false) and u.email_confirmed_at is not null)
$$;
create function palau_private.is_member(p_trip uuid) returns boolean language sql stable security definer set search_path='' as $$
 select palau_private.is_verified() and exists(select 1 from public.palau_members m
  where m.trip_id=p_trip and m.user_id=auth.uid() and m.revoked_at is null)
$$;
create function palau_private.is_organizer(p_trip uuid) returns boolean language sql stable security definer set search_path='' as $$
 select palau_private.is_verified() and exists(select 1 from public.palau_members m
  where m.trip_id=p_trip and m.user_id=auth.uid() and m.revoked_at is null and m.role='organizer')
$$;
grant execute on function palau_private.is_verified(), palau_private.is_member(uuid), palau_private.is_organizer(uuid) to authenticated;

alter table public.palau_trips enable row level security;
alter table public.palau_members enable row level security;
alter table public.palau_arrivals enable row level security;
alter table public.palau_travel_details enable row level security;
alter table public.palau_checklist enable row level security;
alter table public.palau_activities enable row level security;
alter table public.palau_rsvps enable row level security;
alter table public.palau_journal enable row level security;
alter table palau_private.invitations enable row level security;
revoke all on public.palau_trips, public.palau_members, public.palau_arrivals, public.palau_travel_details, public.palau_checklist,
 public.palau_activities, public.palau_rsvps, public.palau_journal from public, anon, authenticated;
revoke all on palau_private.invitations from public, anon, authenticated;
-- No anon access and no broad default grants. RLS + column grants protect immutable identity.
grant select on public.palau_trips, public.palau_members, public.palau_arrivals, public.palau_travel_details, public.palau_checklist,
 public.palau_activities, public.palau_rsvps, public.palau_journal to authenticated;
grant update(title,start_date,end_date,coordination) on public.palau_trips to authenticated;
grant update(display_name) on public.palau_members to authenticated;
grant insert,delete on public.palau_arrivals,public.palau_travel_details,public.palau_checklist,public.palau_activities,public.palau_journal to authenticated;
grant update(arrival_window,departure_window,handoff_note,transfer_status) on public.palau_arrivals to authenticated;
grant update(arrival_at,departure_at,flight_reference,lodging_reference,private_note,updated_at) on public.palau_travel_details to authenticated;
grant update(title,done) on public.palau_checklist to authenticated;
grant update(title,starts_at,description,location,capacity,estimated_cost,cost_note,source_label,source_url,date_flexible,metadata,booking_status) on public.palau_activities to authenticated;
grant update(body,media_path) on public.palau_journal to authenticated;

create policy palau_trip_read on public.palau_trips for select to authenticated using(palau_private.is_member(id));
create policy palau_trip_edit on public.palau_trips for update to authenticated using(palau_private.is_organizer(id)) with check(palau_private.is_organizer(id));
create policy palau_members_read on public.palau_members for select to authenticated using(palau_private.is_member(trip_id));
create policy palau_members_edit_name on public.palau_members for update to authenticated using(user_id=auth.uid() and palau_private.is_member(trip_id)) with check(user_id=auth.uid() and palau_private.is_member(trip_id));
create policy palau_arrivals_read on public.palau_arrivals for select to authenticated using(palau_private.is_member(trip_id));
create policy palau_arrivals_insert on public.palau_arrivals for insert to authenticated with check(user_id=auth.uid() and palau_private.is_member(trip_id));
create policy palau_arrivals_edit on public.palau_arrivals for update to authenticated using(user_id=auth.uid() and palau_private.is_member(trip_id)) with check(user_id=auth.uid() and palau_private.is_member(trip_id));
create policy palau_arrivals_delete on public.palau_arrivals for delete to authenticated using(user_id=auth.uid() and palau_private.is_member(trip_id));
create policy palau_travel_details_read on public.palau_travel_details for select to authenticated using(palau_private.is_member(trip_id) and (user_id=auth.uid() or palau_private.is_organizer(trip_id)));
create policy palau_travel_details_insert on public.palau_travel_details for insert to authenticated with check(user_id=auth.uid() and palau_private.is_member(trip_id));
create policy palau_travel_details_edit on public.palau_travel_details for update to authenticated using(user_id=auth.uid() and palau_private.is_member(trip_id)) with check(user_id=auth.uid() and palau_private.is_member(trip_id));
create policy palau_travel_details_delete on public.palau_travel_details for delete to authenticated using(user_id=auth.uid() and palau_private.is_member(trip_id));
create policy palau_check_read on public.palau_checklist for select to authenticated using(palau_private.is_member(trip_id) and (visibility='shared' or owner_id=auth.uid()));
create policy palau_check_insert on public.palau_checklist for insert to authenticated with check(palau_private.is_member(trip_id) and (owner_id=auth.uid() or (visibility='shared' and palau_private.is_organizer(trip_id))));
create policy palau_check_edit on public.palau_checklist for update to authenticated using(palau_private.is_member(trip_id) and (owner_id=auth.uid() or (visibility='shared' and palau_private.is_organizer(trip_id)))) with check(palau_private.is_member(trip_id) and (owner_id=auth.uid() or (visibility='shared' and palau_private.is_organizer(trip_id))));
create policy palau_check_delete on public.palau_checklist for delete to authenticated using(palau_private.is_member(trip_id) and (owner_id=auth.uid() or (visibility='shared' and palau_private.is_organizer(trip_id))));
create policy palau_activity_read on public.palau_activities for select to authenticated using(palau_private.is_member(trip_id));
create policy palau_activity_insert on public.palau_activities for insert to authenticated with check(palau_private.is_organizer(trip_id));
create policy palau_activity_edit on public.palau_activities for update to authenticated using(palau_private.is_organizer(trip_id)) with check(palau_private.is_organizer(trip_id));
create policy palau_activity_delete on public.palau_activities for delete to authenticated using(palau_private.is_organizer(trip_id));
create policy palau_rsvp_read on public.palau_rsvps for select to authenticated using(palau_private.is_member(trip_id));
create policy palau_journal_read on public.palau_journal for select to authenticated using(palau_private.is_member(trip_id));
create policy palau_journal_insert on public.palau_journal for insert to authenticated with check(user_id=auth.uid() and palau_private.is_member(trip_id));
create policy palau_journal_edit on public.palau_journal for update to authenticated using(user_id=auth.uid() and palau_private.is_member(trip_id)) with check(user_id=auth.uid() and palau_private.is_member(trip_id));
create policy palau_journal_delete on public.palau_journal for delete to authenticated using(palau_private.is_member(trip_id) and (user_id=auth.uid() or palau_private.is_organizer(trip_id)));

create function palau_private.create_trip(p_title text,p_start date,p_end date,p_name text) returns uuid
language plpgsql security definer set search_path='' as $$
declare v_id uuid;
begin
 if not palau_private.is_verified() then raise exception 'Verified sign-in required' using errcode='42501'; end if;
 insert into public.palau_trips(title,start_date,end_date) values(p_title,p_start,p_end) returning id into v_id;
 insert into public.palau_members(trip_id,user_id,display_name,role) values(v_id,auth.uid(),p_name,'organizer');
 return v_id;
end $$;
create function palau_private.create_invite(p_trip uuid,p_email text) returns text
language plpgsql security definer set search_path='' as $$
declare v_token text;
begin
 if not palau_private.is_organizer(p_trip) then raise exception 'Not authorized' using errcode='42501'; end if;
 if length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid email'; end if;
 -- Two cryptographic v4 UUIDs provide 244 random bits; only SHA-256 is persisted.
 v_token := replace(gen_random_uuid()::text || gen_random_uuid()::text,'-','');
 insert into palau_private.invitations(trip_id,invited_email,token_hash,created_by,expires_at)
 values(p_trip,lower(trim(p_email)),sha256(convert_to(v_token,'UTF8')),auth.uid(),now()+interval '7 days');
 return v_token;
end $$;
create function palau_private.accept_invite(p_token text,p_name text) returns uuid
language plpgsql security definer set search_path='' as $$
declare v_inv palau_private.invitations; v_email text;
begin
 if not palau_private.is_verified() then raise exception 'Verified sign-in required' using errcode='42501'; end if;
 if p_token is null or p_token !~ '^[a-f0-9]{64}$' then raise exception 'Invitation unavailable'; end if;
 select lower(email) into v_email from auth.users where id=auth.uid();
 select * into v_inv from palau_private.invitations where token_hash=sha256(convert_to(p_token,'UTF8')) for update;
 if not found or v_inv.accepted_at is not null or v_inv.revoked_at is not null or v_inv.expires_at<=now() or v_inv.invited_email is distinct from v_email then
  raise exception 'Invitation unavailable';
 end if;
 -- A revoked member must be explicitly restored by an organizer, not by an older invitation.
 if exists(select 1 from public.palau_members where trip_id=v_inv.trip_id and user_id=auth.uid() and revoked_at is not null) then raise exception 'Invitation unavailable'; end if;
 insert into public.palau_members(trip_id,user_id,display_name,role) values(v_inv.trip_id,auth.uid(),p_name,'traveler') on conflict(trip_id,user_id) do nothing;
 update palau_private.invitations set accepted_at=now() where id=v_inv.id;
 return v_inv.trip_id;
end $$;
create function palau_private.revoke_member(p_trip uuid,p_user uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
 if not palau_private.is_organizer(p_trip) then raise exception 'Not authorized' using errcode='42501'; end if;
 -- Organizer role transfer is intentionally out of pilot scope.
 update public.palau_members set revoked_at=now() where trip_id=p_trip and user_id=p_user and role='traveler';
 update palau_private.invitations set revoked_at=now() where trip_id=p_trip and accepted_at is null;
end $$;
create function palau_private.revoke_invites(p_trip uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
 if not palau_private.is_organizer(p_trip) then raise exception 'Not authorized' using errcode='42501'; end if;
 update palau_private.invitations set revoked_at=now() where trip_id=p_trip and accepted_at is null;
end $$;
create function palau_private.set_rsvp(p_activity uuid,p_response text) returns void
language plpgsql security definer set search_path='' as $$
declare v_activity public.palau_activities; v_count integer;
begin
 if not palau_private.is_verified() then raise exception 'Verified sign-in required' using errcode='42501'; end if;
 select * into v_activity from public.palau_activities where id=p_activity for update;
 if not found or not palau_private.is_member(v_activity.trip_id) then raise exception 'Not authorized' using errcode='42501'; end if;
 if p_response not in ('going','maybe','not_going') or p_response is null then raise exception 'Invalid response'; end if;
 if v_activity.booking_status='cancelled' and p_response<>'not_going' then raise exception 'Activity cancelled'; end if;
 if p_response='going' and v_activity.capacity is not null then
  select count(*) into v_count from public.palau_rsvps r join public.palau_members m on m.trip_id=r.trip_id and m.user_id=r.user_id
  where r.activity_id=p_activity and r.response='going' and r.user_id<>auth.uid() and m.revoked_at is null;
  if v_count>=v_activity.capacity then raise exception 'Activity full'; end if;
 end if;
 insert into public.palau_rsvps(trip_id,activity_id,user_id,response) values(v_activity.trip_id,p_activity,auth.uid(),p_response)
 on conflict(activity_id,user_id) do update set response=excluded.response,updated_at=now();
end $$;
create function palau_private.check_capacity() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.capacity is not null and new.capacity<(select count(*) from public.palau_rsvps r join public.palau_members m on m.trip_id=r.trip_id and m.user_id=r.user_id where r.activity_id=new.id and r.response='going' and m.revoked_at is null) then raise exception 'Capacity below going count'; end if;
 return new;
end $$;
create trigger palau_capacity_guard before update of capacity on public.palau_activities for each row execute function palau_private.check_capacity();

-- Exposed wrappers use INVOKER; privileged implementation stays in an unexposed schema.
create function public.palau_create_trip(p_title text,p_start date,p_end date,p_name text) returns uuid language sql security invoker set search_path='' as $$ select palau_private.create_trip(p_title,p_start,p_end,p_name) $$;
create function public.palau_create_invite(p_trip uuid,p_email text) returns text language sql security invoker set search_path='' as $$ select palau_private.create_invite(p_trip,p_email) $$;
create function public.palau_accept_invite(p_token text,p_name text) returns uuid language sql security invoker set search_path='' as $$ select palau_private.accept_invite(p_token,p_name) $$;
create function public.palau_revoke_member(p_trip uuid,p_user uuid) returns void language sql security invoker set search_path='' as $$ select palau_private.revoke_member(p_trip,p_user) $$;
create function public.palau_revoke_invites(p_trip uuid) returns void language sql security invoker set search_path='' as $$ select palau_private.revoke_invites(p_trip) $$;
create function public.palau_set_rsvp(p_activity uuid,p_response text) returns void language sql security invoker set search_path='' as $$ select palau_private.set_rsvp(p_activity,p_response) $$;
revoke all on function public.palau_create_trip(text,date,date,text), public.palau_create_invite(uuid,text), public.palau_accept_invite(text,text), public.palau_revoke_member(uuid,uuid), public.palau_revoke_invites(uuid), public.palau_set_rsvp(uuid,text) from public,anon,authenticated;
grant execute on function public.palau_create_trip(text,date,date,text), public.palau_create_invite(uuid,text), public.palau_accept_invite(text,text), public.palau_revoke_member(uuid,uuid), public.palau_revoke_invites(uuid), public.palau_set_rsvp(uuid,text) to authenticated;
grant execute on function palau_private.create_trip(text,date,date,text), palau_private.create_invite(uuid,text), palau_private.accept_invite(text,text), palau_private.revoke_member(uuid,uuid), palau_private.revoke_invites(uuid), palau_private.set_rsvp(uuid,text) to authenticated;

-- Dedicated non-public bucket. Existing permissive legacy storage policies cannot
-- bypass these restrictive fences. Paths: <trip UUID>/<user UUID>/<random file>.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('palau-private','palau-private',false,10485760,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create function palau_private.media_allowed(p_name text,p_own boolean) returns boolean language plpgsql stable security definer set search_path='' as $$
declare v_trip text := split_part(p_name,'/',1); v_user text := split_part(p_name,'/',2);
begin
 if auth.uid() is null or v_trip !~ '^[a-fA-F0-9-]{36}$' or v_user !~ '^[a-fA-F0-9-]{36}$' or split_part(p_name,'/',3)='' then return false; end if;
 return palau_private.is_member(v_trip::uuid) and (not p_own or v_user=auth.uid()::text);
 exception when invalid_text_representation then return false;
end $$;
grant execute on function palau_private.media_allowed(text,boolean) to authenticated;
create policy palau_media_read on storage.objects for select to authenticated using(bucket_id='palau-private' and palau_private.media_allowed(name,false));
create policy palau_media_insert on storage.objects for insert to authenticated with check(bucket_id='palau-private' and palau_private.media_allowed(name,true));
create policy palau_media_update on storage.objects for update to authenticated using(bucket_id='palau-private' and palau_private.media_allowed(name,true)) with check(bucket_id='palau-private' and palau_private.media_allowed(name,true));
-- Organizers may moderate a linked journal attachment, but cannot alter or
-- delete another member's unlinked uploads. Remove media before its journal row.
create policy palau_media_delete on storage.objects for delete to authenticated using(bucket_id='palau-private' and (palau_private.media_allowed(name,true) or exists(select 1 from public.palau_journal j where j.media_path=name and j.trip_id::text=split_part(name,'/',1) and palau_private.is_organizer(j.trip_id))));
create policy palau_media_anon_fence on storage.objects as restrictive for all to anon using(bucket_id<>'palau-private') with check(bucket_id<>'palau-private');
create policy palau_media_read_fence on storage.objects as restrictive for select to authenticated using(case when bucket_id='palau-private' then palau_private.media_allowed(name,false) else true end);
create policy palau_media_insert_fence on storage.objects as restrictive for insert to authenticated with check(case when bucket_id='palau-private' then palau_private.media_allowed(name,true) else true end);
create policy palau_media_update_fence on storage.objects as restrictive for update to authenticated using(case when bucket_id='palau-private' then palau_private.media_allowed(name,true) else true end) with check(case when bucket_id='palau-private' then palau_private.media_allowed(name,true) else true end);
create policy palau_media_delete_fence on storage.objects as restrictive for delete to authenticated using(case when bucket_id='palau-private' then (palau_private.media_allowed(name,true) or exists(select 1 from public.palau_journal j where j.media_path=name and j.trip_id::text=split_part(name,'/',1) and palau_private.is_organizer(j.trip_id))) else true end);
commit;
