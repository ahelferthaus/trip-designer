/** Forward restore/revoke migration tests, in PGlite (not genuine Auth/HTTP concurrency). Auth/Storage APIs are NOT simulated end-to-end.
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

await db.exec(await readFile(new URL('../migrations/20261027161432_palau_private_pilot.sql',import.meta.url),'utf8'));
await db.exec(await readFile(new URL('../migrations/20261031060000_palau_member_restore.sql',import.meta.url),'utf8'));
try {
 await test('forward migration: organizer-only reversible membership with scoped invitations and safe seats',async()=>{
  await as(organizer);
  const trip=(await run("select palau_create_trip('Synthetic restore',$1,$2,'Organizer') id",[FIXTURE_START,FIXTURE_END])).rows[0].id;
  const invite=async email=>(await run('select palau_create_invite($1,$2) token',[trip,email])).rows[0].token;
  const token=await invite('member@example.test');
  await as(member); await run('select palau_accept_invite($1,$2)',[token,'Member']);
  await assert.rejects(run('select palau_restore_member($1,$2)',[trip,member]),/Not authorized/);
  await as(organizer);
  const targetPending=await invite('member@example.test'); const otherPending=await invite('other@example.test');
  const activity=(await run("insert into palau_activities(trip_id,title,capacity,starts_at) values($1,'One seat',1,'2030-03-08T09:00:00Z') returning id",[trip])).rows[0].id;
  await as(member); await run("select palau_set_rsvp($1,'going')",[activity]);
  await as(organizer); await run('select palau_revoke_member($1,$2)',[trip,member]);
  await as(member); assert.equal(await count('palau_trips'),0); await assert.rejects(run('select palau_accept_invite($1,$2)',[targetPending,'Member']),/Invitation unavailable/);
  await as(other); await run('select palau_accept_invite($1,$2)',[otherPending,'Other']); await run("select palau_set_rsvp($1,'going')",[activity]);
  await as(outsider); await assert.rejects(run('select palau_restore_member($1,$2)',[trip,member]),/Not authorized/);
  await as(organizer); await assert.rejects(run('select palau_restore_member($1,$2)',[trip,organizer]),/Traveler unavailable/);
  await run('select palau_restore_member($1,$2)',[trip,member]);
  await as(member); assert.equal(await count('palau_trips'),1); assert.equal((await run('select response from palau_rsvps where user_id=$1',[member])).rows[0].response,'not_going');
  await assert.rejects(run("select palau_set_rsvp($1,'going')",[activity]),/Activity full/);
  await run("select palau_set_rsvp($1,'maybe')",[activity]);
  await as(organizer); await run('select palau_restore_member($1,$2)',[trip,member]);
  assert.equal((await run('select response from palau_rsvps where user_id=$1',[member])).rows[0].response,'maybe');
  const path=`${trip}/${organizer}/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.png`;
  await run("insert into storage.objects(bucket_id,name) values('palau-private',$1)",[path]);
  const entry=(await run("insert into palau_journal(trip_id,user_id,body,media_path) values($1,$2,'Synthetic retry',$3) returning id",[trip,organizer,path])).rows[0].id;
  const proof=()=>run('select palau_journal_media_absent($1,$2,$3) absent',[trip,entry,path]);
  assert.equal((await proof()).rows[0].absent,false);
  await as(other); await assert.rejects(proof(),/Not authorized/);
  await as(outsider); await assert.rejects(proof(),/Not authorized/);
  await as(organizer);
  assert.equal((await run('select palau_journal_media_absent($1,$2,$3) absent',[trip,entry,path+'wrong'])).rows[0].absent,false);
  // Database harness only: emulate a previously successful Storage API removal.
  await run("delete from storage.objects where bucket_id='palau-private' and name=$1",[path]);
  assert.equal((await proof()).rows[0].absent,true);
  await as(null,'anon'); await assert.rejects(run('select palau_restore_member($1,$2)',[trip,member]),/permission denied/);
  await assert.rejects(proof(),/permission denied/);
  await db.exec('reset role');
  assert.equal((await run("select prosecdef from pg_proc where oid='public.palau_restore_member(uuid,uuid)'::regprocedure")).rows[0].prosecdef,false);
  await db.exec('create role untrusted_proof_owner; alter function palau_private.journal_media_absent(uuid,uuid,text) owner to untrusted_proof_owner');
  await as(organizer); await assert.rejects(proof(),/Trusted metadata visibility unavailable/);
 });
} finally { await db.close(); }
