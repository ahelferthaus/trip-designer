-- SYNTHETIC TEST FIXTURE. Fictional data only; never run against a real project.
-- Mirrors the shape of a server-side private group seed so the RLS suite can prove:
--   * seeds run server-side with app.palau_trip_id set in the same session,
--   * repeated runs are idempotent,
--   * owner-only preparation stays private even from the organizer,
--   * planted canary strings (see privacy-canaries.json) never reach a client bundle.
-- Requires an existing trip with an active organizer membership:
--   select set_config('app.palau_trip_id', '<trip uuid>', false);
begin;
do $seed$
declare
  v_trip uuid;
  v_organizer uuid;
  v_member record;
  v_task text;
begin
  if current_setting('app.palau_trip_id', true) is null then
    raise exception 'Set app.palau_trip_id before running the sample private seed fixture';
  end if;
  v_trip := current_setting('app.palau_trip_id')::uuid;
  select user_id into v_organizer from public.palau_members where trip_id=v_trip and role='organizer' and revoked_at is null limit 1;
  if v_organizer is null then raise exception 'Active organizer membership required'; end if;

  update public.palau_trips set
    title='Sample Palau Group (Fixture)', start_date='2030-03-07', end_date='2030-03-19',
    coordination=$json${
      "classification":"CANARY-TRIP-QUOKKA-7731 · synthetic fixture, not a real trip",
      "as_of":"2030-02-01",
      "time_zone":"Pacific/Palau",
      "base":{"name":"Canary Harbor Lodge (fictional)","status":"Fixture lodging placeholder"},
      "cruise":{"name":"Canary Fleet / MV Fixture Pearl (fictional)","dates":"11–18 March 2030","status":"Fixture status; nothing is booked"},
      "timeline":[
        {"date":"2030-03-09","title":"Fixture boat day","status":"Fixture confirmed","time":"morning","location":"Fixture dock"},
        {"date":"2030-03-11","title":"Lodge → boat handoff","status":"Fixture confirmed","time":"afternoon","location":"Fixture lobby","source_label":"Fixture operator note"},
        {"date":"2030-03-18","title":"Boat → lodge","status":"Fixture confirmed","time":"morning","location":"Fixture port"}
      ],
      "public_contacts":[
        {"name":"Canary Harbor Lodge (fictional)","purpose":"Fixture contact","email":"canary.contact@example.invalid","url":"https://example.com/fixture-lodge"}
      ],
      "warnings":[
        "This is a synthetic fixture. No optional activity is booked.",
        "Do not upload passports, medical information, payment data or access codes."
      ]
    }$json$::jsonb
  where id=v_trip;
  if not found then raise exception 'Private trip not found'; end if;

  insert into public.palau_activities(id,trip_id,title,starts_at,description,location,capacity,estimated_cost,cost_note,source_label,source_url,date_flexible,metadata,booking_status) values
  ('51000000-0000-4000-8000-000000000001',v_trip,'Fixture fishing charter','2030-03-09 08:30+09',
   'Synthetic confirmed outing used to prove confirmed status and null cost handling.',
   'Fixture dock',4,null,
   'Quote recorded as a fixture; currency unconfirmed. Do not compute a per-person amount.',
   'Fixture operator note',null,false,
   $json${"priority":"Protected / fixture-confirmed","why":"Exercises the confirmed-plan branch.","timing":"9 Mar · morning","caveat":"Synthetic.","checked_at":"2030-02-01","note":"canary-organizer-note-do-not-ship"}$json$::jsonb,'confirmed'),

  ('51000000-0000-4000-8000-000000000002',v_trip,'Fixture flexible land day','2030-03-08 09:00+09',
   'Synthetic suggested outing used to prove suggested status and flexible dates.',
   'Fixture island',null,null,'Availability and price unconfirmed.',
   'Fixture tourism listing','https://example.com/fixture-land-day',true,
   $json${"priority":"Idea only","why":"Exercises the suggested-plan branch.","timing":"8 or 10 Mar","caveat":"Synthetic.","checked_at":"2030-02-01"}$json$::jsonb,'suggested'),

  ('51000000-0000-4000-8000-000000000003',v_trip,'Fixture group dinner','2030-03-10 18:30+09',
   'Synthetic social anchor with a capacity so RSVP limits can be exercised.',
   'Fixture town',6,25,'Menu-priced fixture estimate.',
   'Fixture restaurant','https://example.com/fixture-dinner',true,
   $json${"priority":"Medium","why":"Exercises capacity-limited RSVP.","timing":"10 Mar · evening","checked_at":"2030-02-01"}$json$::jsonb,'suggested')
  on conflict(id) do update set
    trip_id=excluded.trip_id,title=excluded.title,starts_at=excluded.starts_at,description=excluded.description,
    location=excluded.location,capacity=excluded.capacity,estimated_cost=excluded.estimated_cost,cost_note=excluded.cost_note,
    source_label=excluded.source_label,source_url=excluded.source_url,date_flexible=excluded.date_flexible,
    metadata=excluded.metadata,booking_status=excluded.booking_status;

  -- Owner-only preparation is repeated per active member and must stay invisible to the organizer.
  for v_member in select user_id from public.palau_members where trip_id=v_trip and revoked_at is null loop
    foreach v_task in array array[
      'Fixture: keep travel documents in your own secure wallet',
      'Fixture: confirm personal insurance privately',
      'Fixture: pack reef-friendly essentials'
    ] loop
      insert into public.palau_checklist(trip_id,owner_id,visibility,title)
      select v_trip,v_member.user_id,'personal',v_task
      where not exists(select 1 from public.palau_checklist where trip_id=v_trip and owner_id=v_member.user_id and visibility='personal' and title=v_task);
    end loop;
  end loop;

  foreach v_task in array array[
    'Fixture: keep the lodge → boat handoff window visible to the group',
    'Fixture: coordinate self-arranged airport transfers (CANARY-FLIGHT-ZZ-9909 is a fake reference)'
  ] loop
    insert into public.palau_checklist(trip_id,owner_id,visibility,title)
    select v_trip,v_organizer,'shared',v_task
    where not exists(select 1 from public.palau_checklist where trip_id=v_trip and visibility='shared' and title=v_task);
  end loop;
end
$seed$;
commit;
