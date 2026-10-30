-- Forward upgrade for existing pilot installations. No rows or buckets are deleted.
-- Apply only after reviewing organizer moderation access in staging.
begin;
drop policy if exists palau_media_delete on storage.objects;
drop policy if exists palau_media_delete_fence on storage.objects;
create policy palau_media_delete on storage.objects for delete to authenticated using(bucket_id='palau-private' and (palau_private.media_allowed(name,true) or exists(select 1 from public.palau_journal j where j.media_path=name and j.trip_id::text=split_part(name,'/',1) and palau_private.is_organizer(j.trip_id))));
create policy palau_media_delete_fence on storage.objects as restrictive for delete to authenticated using(case when bucket_id='palau-private' then (palau_private.media_allowed(name,true) or exists(select 1 from public.palau_journal j where j.media_path=name and j.trip_id::text=split_part(name,'/',1) and palau_private.is_organizer(j.trip_id))) else true end);
commit;
