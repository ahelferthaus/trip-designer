/** Executed PostgreSQL RLS tests, in PGlite. Auth/Storage APIs are NOT simulated end-to-end.
 * Uses the synthetic seed fixture in ./fixtures (fictional data only). Install PGlite once, outside the repo:
 *   npm install --prefix <local dir> --ignore-scripts @electric-sql/pglite@0.5.12
 *   PGLITE_MODULE=<local dir>/node_modules/@electric-sql/pglite/dist/index.js node --test supabase/tests/private-pilot.rls.test.mjs
 * With the devDependency installed, `npm run test:rls` works without PGLITE_MODULE.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const organizer=uid(1), member=uid(2), outsider=uid(3), other=uid(4), anonUser=uid(5), unconfirmed=uid(6);
const run = (sql,params=[]) => db.query(sql,params);
const as = async (id,role='authenticated') => { await db.exec('reset role'); await run("select set_config('request.jwt.claim.sub',$1,false)",[id||'']); await db.exec(`set role ${role}`); };
const count = async table => Number((await run(`select count(*) n from ${table}`)).rows[0].n);
const FIXTURE_START='2030-03-07', FIXTURE_END='2030-03-19';
await db.exec(`
 create role anon; create role authenticated;
 create schema auth; create schema storage;
 create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,is_anonymous boolean default false);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema auth,public,storage to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
 alter table storage.objects enable row level security;
 grant select,insert,update,delete on storage.objects to anon,authenticated;
 -- Deliberately broad legacy policy: the pilot's restrictive fence must beat it.
 create policy legacy_public on storage.objects for all using(true) with check(true);
`);
for (const [id,email,anonymous,confirmed] of [[organizer,'organizer@example.test',false,true],[member,'member@example.test',false,true],[outsider,'outsider@example.test',false,true],[other,'other@example.test',false,true],[anonUser,'anonymous@example.test',true,true],[unconfirmed,'unconfirmed@example.test',false,false]]) {
 await run('insert into auth.users values($1,$2,$3,$4)',[id,email,confirmed?new Date().toISOString():null,anonymous]);
}
const migration = await readFile(new URL('../migrations/20261027161432_palau_private_pilot.sql',import.meta.url),'utf8');
const sampleSeed = await readFile(new URL('./fixtures/palau_sample_private_seed.sql',import.meta.url),'utf8');
const { canaries } = JSON.parse(await readFile(new URL('./fixtures/privacy-canaries.json',import.meta.url),'utf8'));
await db.exec(migration);
// Exercise the forward upgrade from the older owner-only deletion policies.
// The separate eight-person suite exercises a fresh installation.
await db.exec(`
 alter policy palau_media_delete on storage.objects using(bucket_id='palau-private' and palau_private.media_allowed(name,true));
 alter policy palau_media_delete_fence on storage.objects using(case when bucket_id='palau-private' then palau_private.media_allowed(name,true) else true end);
`);
const moderationUpgrade = await readFile(new URL('../migrations/20261030203411_palau_linked_journal_media_moderation.sql',import.meta.url),'utf8');
await db.exec(moderationUpgrade);
await db.exec(moderationUpgrade); // safe to reapply; no data deletion
let trip,otherTrip,activity,token;
await test('private pilot actual PostgreSQL policy and RPC regression suite',async t=>{
 const check=(name,fn)=>t.test(name,fn);
 await check('all nine pilot tables have RLS enabled',async()=>{ await as(null,'anon'); await db.exec('reset role'); const r=await run("select relname from pg_class join pg_namespace n on n.oid=relnamespace where (relname like 'palau_%' or (n.nspname='palau_private' and relname='invitations')) and relkind='r'"); assert.equal(r.rows.length,9); for(const {relname} of r.rows){const q=await run('select relrowsecurity from pg_class where relname=$1',[relname]); assert.equal(q.rows[0].relrowsecurity,true);} });
 await check('logged-out cannot read or create a private trip',async()=>{await as(null,'anon'); await assert.rejects(count('palau_trips'),/permission denied/); await assert.rejects(run("select palau_create_trip('X',$1,$2,'X')",[FIXTURE_START,FIXTURE_END]),/permission denied/);});
 await check('anonymous Supabase identity cannot create a trip',async()=>{await as(anonUser); await assert.rejects(run("select palau_create_trip('X',$1,$2,'X')",[FIXTURE_START,FIXTURE_END]),/Verified sign-in/);});
 await check('unconfirmed identity cannot create a trip',async()=>{await as(unconfirmed); await assert.rejects(run("select palau_create_trip('X',$1,$2,'X')",[FIXTURE_START,FIXTURE_END]),/Verified sign-in/);});
 await check('verified organizer creates trip and organizer membership atomically',async()=>{await as(organizer); trip=(await run("select palau_create_trip('Sample Palau',$1,$2,'Sample organizer') id",[FIXTURE_START,FIXTURE_END])).rows[0].id; assert.equal(await count('palau_trips'),1); assert.equal((await run('select role from palau_members')).rows[0].role,'organizer');});
 await check('nonmember sees no trip, members, or activity data',async()=>{await as(outsider); assert.equal(await count('palau_trips'),0); assert.equal(await count('palau_members'),0); assert.equal(await count('palau_activities'),0);});
 await check('nonmember cannot self-join or invite',async()=>{await assert.rejects(run("insert into palau_members values($1,$2,'Evil','organizer',null)",[trip,outsider]),/permission denied/); await assert.rejects(run('select palau_create_invite($1,$2)',[trip,'outsider@example.test']),/Not authorized/);});
 await check('organizer creates random token; invitation hashes not browser-readable',async()=>{await as(organizer); token=(await run('select palau_create_invite($1,$2) token',[trip,'member@example.test'])).rows[0].token; assert.match(token,/^[a-f0-9]{64}$/); await assert.rejects(run('select * from palau_private.invitations'),/permission denied/);});
 await check('wrong account cannot redeem token or reveal invitation details',async()=>{await as(outsider); await assert.rejects(run('select palau_accept_invite($1,$2)',[token,'Wrong account']),/Invitation unavailable/);});
 await check('intended verified account redeems into traveler membership',async()=>{await as(member); assert.equal((await run('select palau_accept_invite($1,$2) id',[token,'Sample traveler'])).rows[0].id,trip); assert.equal(await count('palau_trips'),1);});
 await check('invite replay fails',async()=>{await assert.rejects(run('select palau_accept_invite($1,$2)',[token,'Again']),/Invitation unavailable/);});
 await check('member cannot promote role or alter membership trip/user',async()=>{for(const col of ['role','trip_id','user_id']) await assert.rejects(run(`update palau_members set ${col}=${col}`),/permission denied/);});
 await check('member cannot change trip or create activities/invites',async()=>{assert.equal((await run("update palau_trips set title='Denied' returning id")).rows.length,0); await assert.rejects(run("insert into palau_activities(trip_id,title,starts_at) values($1,'X',now())",[trip]),/row-level security/); await assert.rejects(run('select palau_create_invite($1,$2)',[trip,'outsider@example.test']),/Not authorized/);});
 await check('personal checklist is own-only including against organizer',async()=>{await run("insert into palau_checklist(trip_id,owner_id,visibility,title) values($1,$2,'personal','Personal sample')",[trip,member]); await as(organizer); assert.equal(await count('palau_checklist'),0);});
 await check('organizer creates shared owned checklist; member cannot change identity',async()=>{await run("insert into palau_checklist(trip_id,owner_id,visibility,title) values($1,$2,'shared','Shared sample')",[trip,member]); await as(member); assert.equal(await count('palau_checklist'),2); await run('update palau_checklist set done=true'); await assert.rejects(run("update palau_checklist set visibility='shared'"),/permission denied/); await assert.rejects(run('update palau_checklist set owner_id=$1',[organizer]),/permission denied/);});
 await check('group-visible logistics exclude private references and remain owner-edited',async()=>{await run("insert into palau_arrivals(trip_id,user_id,arrival_window,handoff_note) values($1,$2,'7 Mar afternoon','Meet in lobby')",[trip,member]); await as(organizer); assert.equal((await run('select arrival_window,handoff_note from palau_arrivals')).rows[0].arrival_window,'7 Mar afternoon'); await assert.rejects(run('insert into palau_arrivals(trip_id,user_id) values($1,$2)',[trip,outsider]),/row-level security/); assert.equal((await run("update palau_arrivals set handoff_note='Denied' returning user_id")).rows.length,0);});
 await check('exact travel details are owner-written and visible only to owner plus organizer',async()=>{await as(member); await run("insert into palau_travel_details(trip_id,user_id,flight_reference,private_note) values($1,$2,'Sample flight','Organizer-only coordination')",[trip,member]); assert.equal(await count('palau_travel_details'),1); await as(organizer); const rows=(await run('select user_id,flight_reference from palau_travel_details')).rows; assert.equal(rows.length,1); assert.equal(rows[0].user_id,member); assert.equal((await run("update palau_travel_details set private_note='Denied' returning user_id")).rows.length,0); await assert.rejects(run("insert into palau_travel_details(trip_id,user_id,private_note) values($1,$2,'Spoof')",[trip,member]),/row-level security/); await as(outsider); assert.equal(await count('palau_travel_details'),0);});
 await check('organizer creates capacity-limited activity',async()=>{await as(organizer); activity=(await run("insert into palau_activities(trip_id,title,starts_at,capacity) values($1,'Sample activity',now(),1) returning id",[trip])).rows[0].id;});
 await check('RSVP uses authenticated identity and cannot be written directly',async()=>{await as(member); await assert.rejects(run("insert into palau_rsvps values($1,$2,$3,'going',now())",[trip,activity,organizer]),/permission denied/); await run('select palau_set_rsvp($1,$2)',[activity,'going']); assert.equal((await run('select user_id from palau_rsvps')).rows[0].user_id,member);});
 await check('full activity rejects another Going; Maybe still works',async()=>{await as(organizer); await assert.rejects(run('select palau_set_rsvp($1,$2)',[activity,'going']),/Activity full/); await run('select palau_set_rsvp($1,$2)',[activity,'maybe']);});
 await check('repeat Going is idempotent; declining frees capacity',async()=>{await as(member); await run('select palau_set_rsvp($1,$2)',[activity,'going']); await run('select palau_set_rsvp($1,$2)',[activity,'not_going']); await as(organizer); await run('select palau_set_rsvp($1,$2)',[activity,'going']); assert.equal((await run("select count(*) n from palau_rsvps where response='going'")).rows[0].n,1);});
 await check('capacity cannot be lowered below attending count',async()=>{await run('update palau_activities set capacity=2 where id=$1',[activity]); await as(member); await run('select palau_set_rsvp($1,$2)',[activity,'going']); await as(organizer); await assert.rejects(run('update palau_activities set capacity=1 where id=$1',[activity]),/Capacity below going count/);});
 await check('trip ids cannot be reassigned on activities and cross-trip data is hidden',async()=>{await assert.rejects(run('update palau_activities set trip_id=trip_id'),/permission denied/); await as(other); otherTrip=(await run("select palau_create_trip('Other',$1,$2,'Other') id",[FIXTURE_START,FIXTURE_END])).rows[0].id; assert.notEqual(otherTrip,trip); assert.equal(await count('palau_activities'),0); await assert.rejects(run('select palau_set_rsvp($1,$2)',[activity,'maybe']),/Not authorized/);});
 await check('journal write requires own identity and trip membership',async()=>{await as(member); await run("insert into palau_journal(trip_id,user_id,body) values($1,$2,'Sample memory')",[trip,member]); await assert.rejects(run("insert into palau_journal(trip_id,user_id,body) values($1,$2,'Denied')",[otherTrip,member]),/row-level security/); await assert.rejects(run("insert into palau_journal(trip_id,user_id,body) values($1,$2,'Denied')",[trip,organizer]),/row-level security/);});
 await check('signed media bucket is private and member path insert works',async()=>{await db.exec('reset role'); assert.equal((await run("select public from storage.buckets where id='palau-private'")).rows[0].public,false); await as(member); await run("insert into storage.objects(bucket_id,name) values('palau-private',$1)",[`${trip}/${member}/sample.jpg`]); assert.equal(await count('storage.objects'),1);});
 await check('other members read media but cannot mutate another user path despite legacy policy',async()=>{await as(organizer); assert.equal(await count('storage.objects'),1); assert.equal((await run("delete from storage.objects where bucket_id='palau-private' returning id")).rows.length,0); await assert.rejects(run("insert into storage.objects(bucket_id,name) values('palau-private',$1)",[`${trip}/${member}/spoof.jpg`]),/row-level security/);});
 await check('nonmember and logged-out cannot access pilot media despite permissive legacy policy',async()=>{await as(outsider); assert.equal(await count('storage.objects'),0); await as(null,'anon'); assert.equal(await count('storage.objects'),0); await assert.rejects(run("insert into storage.objects(bucket_id,name) values('palau-private','spoof')"),/row-level security/);});
 await check('synthetic group seed is server-side, idempotent and keeps owner preparations private',async()=>{
  // Seeds run only as the database owner with the trip id set in-session; browser roles cannot perform the
  // organizer-only trip/activity writes it contains (covered by the earlier member-denial checks).
  await db.exec('reset role'); await run("select set_config('app.palau_trip_id',$1,false)",[trip]); await db.exec(sampleSeed);
  await as(organizer);
  const seededActivities=()=>run("select count(*) n from palau_activities where id::text like '51000000-0000-4000-8000-%'").then(r=>Number(r.rows[0].n));
  assert.equal(await seededActivities(),3);
  assert.equal((await run('select title from palau_trips where id=$1',[trip])).rows[0].title,'Sample Palau Group (Fixture)');
  const confirmed=(await run("select estimated_cost,cost_note,booking_status from palau_activities where id='51000000-0000-4000-8000-000000000001'")).rows[0];
  assert.equal(confirmed.estimated_cost,null); assert.equal(confirmed.booking_status,'confirmed'); assert.match(confirmed.cost_note,/currency unconfirmed/i);
  const flexible=(await run("select booking_status,date_flexible from palau_activities where id='51000000-0000-4000-8000-000000000002'")).rows[0];
  assert.equal(flexible.booking_status,'suggested'); assert.equal(flexible.date_flexible,true);
  assert.equal(await count('palau_travel_details'),1,'seed never creates travel details for other users');
  await as(member);
  assert.ok(Number((await run("select count(*) n from palau_checklist where visibility='personal' and owner_id=$1",[member])).rows[0].n)>0);
  assert.equal(Number((await run("select count(*) n from palau_checklist where visibility='shared' and title like 'Fixture:%'")).rows[0].n),2);
  await as(organizer);
  assert.equal(Number((await run("select count(*) n from palau_checklist where visibility='personal' and owner_id=$1",[member])).rows[0].n),0);
  const coordination=JSON.stringify((await run('select coordination from palau_trips where id=$1',[trip])).rows[0].coordination);
  assert.ok(canaries.some(canary=>coordination.includes(canary)),'canary planted server-side is readable only through authorized trip rows');
  await as(outsider); assert.equal(await count('palau_trips'),0,'canaries never reach a nonmember');
  await db.exec('reset role'); await run("select set_config('app.palau_trip_id',$1,false)",[trip]); await db.exec(sampleSeed);
  await as(organizer); assert.equal(await seededActivities(),3,'re-running the seed is idempotent');
  assert.equal(Number((await run("select count(*) n from palau_checklist where visibility='shared' and title like 'Fixture:%'")).rows[0].n),2,'shared fixture tasks are not duplicated');
 });
 await check('expired and revoked invitations cannot redeem',async()=>{await as(organizer); const expired=(await run('select palau_create_invite($1,$2) token',[trip,'outsider@example.test'])).rows[0].token; await db.exec('reset role'); await run("update palau_private.invitations set expires_at=now()-interval '1 day' where token_hash=sha256(convert_to($1,'UTF8'))",[expired]); await as(outsider); await assert.rejects(run('select palau_accept_invite($1,$2)',[expired,'Outsider']),/Invitation unavailable/); await as(organizer); const revoked=(await run('select palau_create_invite($1,$2) token',[trip,'outsider@example.test'])).rows[0].token; await run('select palau_revoke_invites($1)',[trip]); await as(outsider); await assert.rejects(run('select palau_accept_invite($1,$2)',[revoked,'Outsider']),/Invitation unavailable/);});
 await check('revoked membership removes all trip/media access immediately at database layer',async()=>{await as(organizer); await run('select palau_revoke_member($1,$2)',[trip,member]); await as(member); for(const table of ['palau_trips','palau_members','palau_arrivals','palau_travel_details','palau_checklist','palau_activities','palau_rsvps','palau_journal','storage.objects']) assert.equal(await count(table),0); await assert.rejects(run('select palau_set_rsvp($1,$2)',[activity,'maybe']),/Not authorized/);});
 await check('organizer may remove linked journal media but not unlinked member uploads',async()=>{
  await db.exec('reset role');
  await run('update palau_members set revoked_at=null where trip_id=$1 and user_id=$2',[trip,member]);
  await as(member);
  const path=`${trip}/${member}/moderation.jpg`;
  await run("insert into storage.objects(bucket_id,name) values('palau-private',$1)",[path]);
  const entry=(await run("insert into palau_journal(trip_id,user_id,body,media_path) values($1,$2,'Synthetic moderation example',$3) returning id",[trip,member,path])).rows[0].id;
  await as(organizer);
  assert.equal((await run("delete from storage.objects where bucket_id='palau-private' and name=$1 returning id",[path])).rows.length,1);
  assert.equal((await run('delete from palau_journal where id=$1 returning id',[entry])).rows.length,1);
  await run('select palau_revoke_member($1,$2)',[trip,member]);
 });
 await check('all public pilot RPCs are invoker functions; anon has no execute grants',async()=>{await db.exec('reset role'); const rows=(await run("select p.oid,p.proname,p.prosecdef from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'palau_%'")).rows; assert.equal(rows.length,6); for(const row of rows){assert.equal(row.prosecdef,false); assert.equal((await run("select has_function_privilege('anon',$1,'execute') allowed",[row.oid])).rows[0].allowed,false);} });
});
await db.close();
