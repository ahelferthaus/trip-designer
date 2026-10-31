/** Local PostgreSQL policy tests; serialized PGlite, not concurrent HTTP sessions. */
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

await db.exec(await readFile(new URL('../migrations/20261027161432_palau_private_pilot.sql',import.meta.url),'utf8'));
await db.exec(await readFile(new URL('../migrations/20261031060000_palau_member_restore.sql',import.meta.url),'utf8'));
await db.exec(await readFile(new URL('../migrations/20261031071157_general_trip_foundation.sql',import.meta.url),'utf8'));
const create = async (request=uid(100),limit=2,title='Tokyo discovery',zone='Asia/Tokyo') => (await run('select vybr_create_trip($1,$2,$3,$4,$5,$6,$7,$8,auth.uid()) id',[request,title,'Tokyo','2030-04-01','2030-04-10',zone,limit,'Organizer'])).rows[0].id;
try {
 await test('general trip foundation security and compatibility',async t=>{
  let trip,otherTrip,token,overflow;
  await t.test('only verified nonanonymous accounts may create; anon execute is denied',async()=>{
   for(const id of [anonUser,unconfirmed]) { await as(id);await assert.rejects(create(),/Verified sign-in required/); }
   await as(null,'anon');await assert.rejects(create(),/permission denied/);
  });
  await t.test('atomic creation assigns caller organizer and destination/zone/capacity',async()=>{
   await as(organizer);trip=await create();
   const row=(await run('select * from palau_trips where id=$1',[trip])).rows[0];
   assert.equal(row.time_zone,'Asia/Tokyo');assert.equal(row.destination,'Tokyo');assert.equal(row.participant_limit,2);
   assert.deepEqual((await run('select user_id,role from palau_members where trip_id=$1',[trip])).rows,[{user_id:organizer,role:'organizer'}]);
  });
  await t.test('same request is idempotent; changed payload rejected without extra trips',async()=>{
   assert.equal(await create(),trip);assert.equal(await create(uid(100),2,'  Tokyo discovery  '),trip);await assert.rejects(create(uid(100),3),/different trip details/);assert.equal(await count('palau_trips'),1);
  });
  await t.test('invalid dates, zones, names and limits create no partial trip',async()=>{
   for(const limit of [0,101,null]) await assert.rejects(create(uid(101),limit),/Invalid trip details/);
   for(const zone of ['Not/AZone','EST','posix/Europe/London','right/UTC']) await assert.rejects(create(uid(101),2,'Tokyo',zone),/Invalid trip details/);
   await assert.rejects(run("select vybr_create_trip($1,'x','x','2030-04-10','2030-04-01','UTC',8,'Name',auth.uid())",[uid(102)]),/Invalid trip details/);
   await assert.rejects(run("select vybr_create_trip($1,'x','x','2030-04-01','2030-04-10','UTC',8,'',auth.uid())",[uid(102)]),/Invalid trip details/);
   assert.equal(await count('palau_trips'),1);
  });
  await t.test('caller cannot directly create memberships, reassign role, or read idempotency ledger',async()=>{
   await assert.rejects(run("insert into palau_members values($1,$2,'Forged','organizer',null)",[trip,outsider]),/permission denied/);
   await assert.rejects(run("update palau_members set role='traveler' where trip_id=$1",[trip]),/permission denied/);
   await assert.rejects(run('select * from palau_private.trip_creation_requests'),/permission denied/);
   await assert.rejects(run("update palau_trips set time_zone='UTC' where id=$1",[trip]),/permission denied/);
   await assert.rejects(run('update palau_members set revoked_at=null where trip_id=$1',[trip]),/permission denied/);
   await assert.rejects(run('update palau_trips set participant_limit=100 where id=$1',[trip]),/permission denied/);
  });
  await t.test('outsider can own another trip but cannot see, edit or invite to this one',async()=>{
   await as(outsider);assert.equal(await count('palau_trips'),0);otherTrip=await create(uid(100),3,'London route','Europe/London');assert.notEqual(otherTrip,trip);
   assert.equal((await run("update palau_trips set title='Hijacked' where id=$1 returning id",[trip])).rows.length,0);
   await assert.rejects(run('select palau_create_invite($1,$2)',[trip,'other@example.test']),/Not authorized/);
   assert.equal(await count('palau_trips'),1);
  });
  await t.test('invitation admits traveler up to group limit including organizer',async()=>{
   await as(organizer);token=(await run('select palau_create_invite($1,$2) token',[trip,'member@example.test'])).rows[0].token;
   overflow=(await run('select palau_create_invite($1,$2) token',[trip,'other@example.test'])).rows[0].token;
   await as(member);await run('select palau_accept_invite($1,$2)',[token,'Traveler']);
   assert.equal((await run('select role from palau_members where trip_id=$1 and user_id=$2',[trip,member])).rows[0].role,'traveler');
   await assert.rejects(run('select palau_create_invite($1,$2)',[trip,'outsider@example.test']),/Not authorized/);
   assert.equal((await run('select id from palau_trips where id=$1',[otherTrip])).rows.length,0);
   await as(other);await assert.rejects(run('select palau_accept_invite($1,$2)',[overflow,'Other']),/participant limit/);
  });
  await t.test('already-active traveler may accept another invitation even when full',async()=>{
   await as(organizer);const again=(await run('select palau_create_invite($1,$2) token',[trip,'member@example.test'])).rows[0].token;
   await as(member);await run('select palau_accept_invite($1,$2)',[again,'Traveler']);
  });
  await t.test('revoke frees a participant place; failed acceptance did not consume invite; restore cannot overfill',async()=>{
   await as(organizer);await run('select palau_revoke_member($1,$2)',[trip,member]);
   await as(other);await run('select palau_accept_invite($1,$2)',[overflow,'Other']);
   await as(organizer);await assert.rejects(run('select palau_restore_member($1,$2)',[trip,member]),/participant limit/);
   assert.notEqual((await run('select revoked_at from palau_members where trip_id=$1 and user_id=$2',[trip,member])).rows[0].revoked_at,null);
   await run('select palau_revoke_member($1,$2)',[trip,other]);await run('select palau_restore_member($1,$2)',[trip,member]);
   assert.equal((await run('select count(*) n from palau_members where trip_id=$1 and revoked_at is null',[trip])).rows[0].n,2);
  });
  await t.test('activity capacity remains separate from participant capacity',async()=>{
   const activity=(await run("insert into palau_activities(trip_id,title,starts_at,capacity) values($1,'One seat','2030-04-02',1) returning id",[trip])).rows[0].id;
   await run("select palau_set_rsvp($1,'going')",[activity]);await as(member);await assert.rejects(run("select palau_set_rsvp($1,'going')",[activity]),/Activity full/);
  });
  await t.test('one account may organize one trip and travel on another; organizer roles cannot leak',async()=>{
   const own=await create(uid(103),1,'Solo journey','UTC');assert.notEqual(own,trip);
   assert.equal((await run('select role from palau_members where trip_id=$1 and user_id=$2',[own,member])).rows[0].role,'organizer');
   await assert.rejects(run("update palau_members set role='organizer' where trip_id=$1 and user_id=$2",[trip,member]),/permission denied/);
   assert.equal((await run('select role from palau_members where trip_id=$1 and user_id=$2',[trip,member])).rows[0].role,'traveler');
  });
  await t.test('legacy creation remains compatible with Palau zone and unspecified group limit',async()=>{
   await as(organizer);const id=(await run("select palau_create_trip('Legacy',$1,$2,'Organizer') id",[FIXTURE_START,FIXTURE_END])).rows[0].id;
   const row=(await run('select time_zone,participant_limit from palau_trips where id=$1',[id])).rows[0];assert.equal(row.time_zone,'Pacific/Palau');assert.equal(row.participant_limit,null);
  });
  await t.test('membership failure rolls back trip and request ledger atomically',async()=>{
   await db.exec('reset role');
   await db.exec("create function public.test_creation_failure() returns trigger language plpgsql as $$ begin if new.display_name='Force failure' then raise exception 'Synthetic failure'; end if;return new;end $$; create trigger test_failure before insert on public.palau_members for each row execute function public.test_creation_failure();");
   await as(organizer);
   await assert.rejects(run("select vybr_create_trip($1,'Rollback','Route','2030-01-01','2030-01-02','UTC',8,'Force failure',auth.uid())",[uid(111)]),/Synthetic failure/);
   await db.exec('reset role');
   assert.equal((await run('select count(*) n from palau_private.trip_creation_requests where request_id=$1',[uid(111)])).rows[0].n,0);
   assert.equal((await run("select count(*) n from palau_trips where title='Rollback'")).rows[0].n,0);
  });
  await t.test('expected-account guard cannot grant ownership to another user',async()=>{
   await as(organizer);
   await assert.rejects(run("select vybr_create_trip($1,'x','x','2030-04-01','2030-04-10','UTC',8,'Name',$2)",[uid(112),outsider]),/Account changed/);
  });
  await t.test('failed input request is reusable; revoked organizer cannot replay existing request',async()=>{
   await as(organizer);await assert.rejects(create(uid(113),0),/Invalid trip details/);const created=await create(uid(113),2);
   await db.exec('reset role');await run('update palau_members set revoked_at=now() where trip_id=$1 and user_id=$2',[created,organizer]);
   await as(organizer);await assert.rejects(create(uid(113),2),/Not authorized/);
  });
  await t.test('limited trip creation and acceptance reject unsupported isolation, then recover at read committed',async()=>{
   await as(organizer);
   await db.exec('begin isolation level repeatable read');
   await assert.rejects(create(uid(120),2),/read committed isolation/);await db.exec('rollback');
   const limited=await create(uid(120),2);
   const invitation=(await run('select palau_create_invite($1,$2) token',[limited,'other@example.test'])).rows[0].token;
   await as(other);
   for(const isolation of ['repeatable read','serializable']) {
    await db.exec(`begin isolation level ${isolation}`);
    await assert.rejects(run('select palau_accept_invite($1,$2)',[invitation,'Other']),/read committed isolation/);
    await db.exec('rollback');
   }
   await run('select palau_accept_invite($1,$2)',[invitation,'Other']);
   assert.equal((await run('select count(*) n from palau_members where trip_id=$1 and revoked_at is null',[limited])).rows[0].n,2);
   await as(organizer);await db.exec('begin isolation level repeatable read');
   const legacy=(await run("select palau_create_trip('Legacy isolation','2030-04-01','2030-04-02','Organizer') id")).rows[0].id;
   assert.equal((await run('select participant_limit from palau_trips where id=$1',[legacy])).rows[0].participant_limit,null);
   await db.exec('rollback');
  });
  await t.test('new exposed RPC is invoker; no anonymous grants',async()=>{
   await db.exec('reset role');const r=(await run("select p.prosecdef, has_function_privilege('anon',p.oid,'EXECUTE') anon from pg_proc p join pg_namespace n on p.pronamespace=n.oid where n.nspname='public' and p.proname='vybr_create_trip'")).rows[0];assert.equal(r.prosecdef,false);assert.equal(r.anon,false);
  });
 });
} finally {await db.close();}
