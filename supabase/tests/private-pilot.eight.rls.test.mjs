/** Eight-person regression suite: executed PostgreSQL RLS/RPC checks in PGlite against the current migration.
 *
 * Scope and limits (read before citing this as evidence):
 *  - Fresh synthetic harness: stubbed auth.users / auth.uid() and storage.objects, like private-pilot.rls.test.mjs.
 *    Supabase Auth, PostgREST, Storage uploads, signed URLs and sessions are NOT exercised.
 *  - Identities are synthetic UUIDs with example.test addresses. No invitation email is sent anywhere; the
 *    harness hands each invite token straight to the intended identity, exactly as a user would paste a link.
 *  - PGlite is a single-connection database. Promise.all / Promise.allSettled below only interleaves JavaScript
 *    promises; PGlite serializes statement execution, so the "concurrent" RSVP race is sequential at the database.
 *    It proves the capacity RPC's accounting under back-to-back submissions, NOT genuine hosted multi-session
 *    concurrency. Hosted evidence must come from eight real authenticated sessions against staging.
 *  - All dates are the fictional March 2030 window. No staging identifiers appear here.
 *
 * Run: `npm run test:rls` (devDependency) or
 *   PGLITE_MODULE=<dir>/node_modules/@electric-sql/pglite/dist/index.js node --test supabase/tests/private-pilot.eight.rls.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const uid = n => `10000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const ORGANIZER = { id: uid(1), email: 'organizer@example.test', name: 'Synthetic organizer' };
const TRAVELERS = [2, 3, 4, 5, 6, 7, 8].map(n => ({ id: uid(n), email: `traveler-${n}@example.test`, name: `Synthetic traveler ${n}` }));
const GROUP = [ORGANIZER, ...TRAVELERS];
const OUTSIDER = { id: uid(9), email: 'outsider@example.test', name: 'Outsider' };
const UNCONFIRMED = { id: uid(10), email: 'unconfirmed@example.test', name: 'Unconfirmed' };
const FIXTURE_START = '2030-03-07', FIXTURE_END = '2030-03-19';
assert.equal(GROUP.length, 8, 'group is exactly eight people including the organizer');

const run = (sql, params = []) => db.query(sql, params);
const as = async (id, role = 'authenticated') => { await db.exec('reset role'); await run("select set_config('request.jwt.claim.sub',$1,false)", [id || '']); await db.exec(`set role ${role}`); };
const count = async (table, where = '') => Number((await run(`select count(*) n from ${table} ${where}`)).rows[0].n);
const goingRows = async activity => Number((await run("select count(*) n from palau_rsvps where activity_id=$1 and response='going'", [activity])).rows[0].n);
/** Effective seats as the RPC counts them: Going rows whose membership is still active. */
const effectiveGoing = async activity => Number((await run("select count(*) n from palau_rsvps r join palau_members m on m.trip_id=r.trip_id and m.user_id=r.user_id where r.activity_id=$1 and r.response='going' and m.revoked_at is null", [activity])).rows[0].n);
/** One batch per actor so identity and RPC travel together; a failed batch rolls back its own role/claim changes. */
const rsvpAs = (id, activity, response) => {
  assert.match(id, UUID); assert.match(activity, UUID); assert.match(response, /^(going|maybe|not_going)$/);
  return db.exec(`reset role; select set_config('request.jwt.claim.sub','${id}',false); set role authenticated; select public.palau_set_rsvp('${activity}','${response}');`);
};

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
 create policy legacy_public on storage.objects for all using(true) with check(true);
`);
for (const person of [...GROUP, OUTSIDER]) await run('insert into auth.users values($1,$2,$3,false)', [person.id, person.email, new Date().toISOString()]);
await run('insert into auth.users values($1,$2,null,false)', [UNCONFIRMED.id, UNCONFIRMED.email]);
await db.exec(await readFile(new URL('../migrations/20261027161432_palau_private_pilot.sql', import.meta.url), 'utf8'));

let trip, fourSeat, openDinner;
const tokens = new Map();
const revoked = TRAVELERS[6];

await test('eight-person private pilot regression suite (PGlite, serialized execution)', async t => {
  const check = (name, fn) => t.test(name, fn);

  await check('organizer creates the trip and seven invitations; tokens are random and never readable by browsers', async () => {
    await as(ORGANIZER.id);
    trip = (await run('select palau_create_trip($1,$2,$3,$4) id', ['Synthetic eight-person group', FIXTURE_START, FIXTURE_END, ORGANIZER.name])).rows[0].id;
    for (const traveler of TRAVELERS) tokens.set(traveler.id, (await run('select palau_create_invite($1,$2) token', [trip, traveler.email])).rows[0].token);
    assert.equal(new Set(tokens.values()).size, 7);
    for (const token of tokens.values()) assert.match(token, /^[a-f0-9]{64}$/);
    await assert.rejects(run('select * from palau_private.invitations'), /permission denied/);
  });

  await check('outsider and unconfirmed identities cannot redeem another person\'s token', async () => {
    await as(OUTSIDER.id); await assert.rejects(run('select palau_accept_invite($1,$2)', [tokens.get(TRAVELERS[0].id), OUTSIDER.name]), /Invitation unavailable/);
    await as(UNCONFIRMED.id); await assert.rejects(run('select palau_accept_invite($1,$2)', [tokens.get(TRAVELERS[0].id), UNCONFIRMED.name]), /Verified sign-in/);
    await as(ORGANIZER.id); assert.equal(await count('palau_members'), 1, 'no membership was created by the failed attempts');
  });

  await check('all seven travelers accept their own token; replay fails; everyone sees the full roster', async () => {
    for (const traveler of TRAVELERS) {
      await as(traveler.id);
      assert.equal((await run('select palau_accept_invite($1,$2) id', [tokens.get(traveler.id), traveler.name])).rows[0].id, trip);
      await assert.rejects(run('select palau_accept_invite($1,$2)', [tokens.get(traveler.id), 'Replay']), /Invitation unavailable/);
    }
    for (const person of GROUP) {
      await as(person.id);
      assert.equal(await count('palau_members'), 8);
      assert.equal(await count('palau_members', "where role='organizer'"), 1);
      assert.equal(await count('palau_members', "where role='traveler'"), 7);
      assert.equal(await count('palau_trips'), 1);
    }
  });

  await check('each person records own travel details, group arrival window and a personal checklist item', async () => {
    for (const [index, person] of GROUP.entries()) {
      await as(person.id);
      await run("insert into palau_travel_details(trip_id,user_id,flight_reference,lodging_reference,private_note) values($1,$2,$3,$4,$5)", [trip, person.id, `Synthetic reference ${index + 1}`, 'Synthetic lodging', `Private note of ${person.name}`]);
      await run("insert into palau_arrivals(trip_id,user_id,arrival_window,handoff_note) values($1,$2,$3,$4)", [trip, person.id, `7 Mar wave ${index + 1}`, 'Synthetic handoff']);
      await run("insert into palau_checklist(trip_id,owner_id,visibility,title) values($1,$2,'personal',$3)", [trip, person.id, `Personal item of ${person.name}`]);
    }
    await as(ORGANIZER.id);
    for (const title of ['Shared: confirm pickup windows', 'Shared: boat meeting point']) await run("insert into palau_checklist(trip_id,owner_id,visibility,title) values($1,$2,'shared',$3)", [trip, ORGANIZER.id, title]);
  });

  await check('every traveler sees only own travel details and personal items, all arrivals and all shared items', async () => {
    for (const traveler of TRAVELERS) {
      await as(traveler.id);
      const details = (await run('select user_id,private_note from palau_travel_details')).rows;
      assert.equal(details.length, 1); assert.equal(details[0].user_id, traveler.id); assert.equal(details[0].private_note, `Private note of ${traveler.name}`);
      for (const other of GROUP.filter(person => person.id !== traveler.id)) assert.equal(await count('palau_travel_details', `where user_id='${other.id}'`), 0);
      const personal = (await run("select owner_id from palau_checklist where visibility='personal'")).rows;
      assert.equal(personal.length, 1); assert.equal(personal[0].owner_id, traveler.id);
      assert.equal(await count('palau_checklist', "where visibility='shared'"), 2);
      assert.equal(await count('palau_arrivals'), 8, 'arrival windows are group-visible for all eight');
      assert.equal((await run("update palau_travel_details set private_note='Denied' where user_id<>$1 returning user_id", [traveler.id])).rows.length, 0);
      assert.equal((await run("update palau_arrivals set handoff_note='Denied' where user_id<>$1 returning user_id", [traveler.id])).rows.length, 0);
      await assert.rejects(run("insert into palau_travel_details(trip_id,user_id,private_note) values($1,$2,'Spoof')", [trip, ORGANIZER.id]), /row-level security/);
    }
  });

  await check('organizer sees all eight travel details but cannot edit or spoof them and never sees other personal items', async () => {
    await as(ORGANIZER.id);
    const details = (await run('select user_id from palau_travel_details order by user_id')).rows.map(row => row.user_id);
    assert.deepEqual(details, GROUP.map(person => person.id).sort());
    assert.equal((await run("update palau_travel_details set private_note='Denied' where user_id<>$1 returning user_id", [ORGANIZER.id])).rows.length, 0);
    assert.equal((await run("delete from palau_travel_details where user_id<>$1 returning user_id", [ORGANIZER.id])).rows.length, 0);
    await assert.rejects(run("insert into palau_travel_details(trip_id,user_id,private_note) values($1,$2,'Spoof')", [trip, TRAVELERS[0].id]), /row-level security/);
    const personal = (await run("select owner_id from palau_checklist where visibility='personal'")).rows;
    assert.equal(personal.length, 1); assert.equal(personal[0].owner_id, ORGANIZER.id);
    assert.equal((await run("update palau_checklist set done=true where visibility='personal' and owner_id<>$1 returning id", [ORGANIZER.id])).rows.length, 0);
    assert.equal((await run("update palau_arrivals set handoff_note='Denied' where user_id<>$1 returning user_id", [ORGANIZER.id])).rows.length, 0);
    assert.equal(await count('palau_arrivals'), 8);
  });

  await check('outsider and logged-out sessions are denied everything', async () => {
    await as(OUTSIDER.id);
    for (const table of ['palau_trips', 'palau_members', 'palau_arrivals', 'palau_travel_details', 'palau_checklist', 'palau_activities', 'palau_rsvps', 'palau_journal', 'storage.objects']) assert.equal(await count(table), 0, `${table} hidden from outsider`);
    await assert.rejects(run("insert into palau_travel_details(trip_id,user_id,private_note) values($1,$2,'Spoof')", [trip, OUTSIDER.id]), /row-level security/);
    await assert.rejects(run("insert into palau_checklist(trip_id,owner_id,visibility,title) values($1,$2,'personal','Spoof')", [trip, OUTSIDER.id]), /row-level security/);
    await assert.rejects(run('select palau_create_invite($1,$2)', [trip, OUTSIDER.email]), /Not authorized/);
    await as(null, 'anon');
    await assert.rejects(count('palau_trips'), /permission denied/);
    await assert.rejects(run('select palau_set_rsvp($1,$2)', [trip, 'going']), /permission denied/);
  });

  await check('organizer creates a four-seat activity and an uncapped one; capacity stays activity-specific', async () => {
    await as(ORGANIZER.id);
    fourSeat = (await run("insert into palau_activities(trip_id,title,starts_at,capacity) values($1,'Synthetic four-seat table','2030-03-10 18:00+09',4) returning id", [trip])).rows[0].id;
    openDinner = (await run("insert into palau_activities(trip_id,title,starts_at,capacity) values($1,'Synthetic open dinner','2030-03-12 18:00+09',null) returning id", [trip])).rows[0].id;
    await as(TRAVELERS[0].id);
    assert.equal((await run('update palau_activities set capacity=8 where id=$1 returning id', [fourSeat])).rows.length, 0, 'travelers cannot widen capacity');
    await assert.rejects(run("insert into palau_activities(trip_id,title,starts_at,capacity) values($1,'Spoof',now(),8)", [trip]), /row-level security/);
    await as(ORGANIZER.id);
    assert.equal((await run('select capacity from palau_activities where id=$1', [fourSeat])).rows[0].capacity, 4);
  });

  await check('eight Going submissions race for four seats: exactly four succeed (serialized by PGlite, not hosted concurrency)', async () => {
    const results = await Promise.allSettled(GROUP.map(person => rsvpAs(person.id, fourSeat, 'going')));
    const winners = results.filter(result => result.status === 'fulfilled').length;
    const losers = results.filter(result => result.status === 'rejected');
    assert.equal(winners, 4);
    assert.equal(losers.length, 4);
    for (const loser of losers) assert.match(String(loser.reason?.message ?? loser.reason), /Activity full/);
    await as(ORGANIZER.id);
    assert.equal(await goingRows(fourSeat), 4);
    assert.equal(await count('palau_rsvps', `where activity_id='${fourSeat}'`), 4, 'a refused Going leaves no row behind');
  });

  await check('losers may still answer Maybe concurrently; repeated Going by winners is idempotent', async () => {
    await as(ORGANIZER.id);
    const winnerIds = (await run("select user_id from palau_rsvps where activity_id=$1 and response='going'", [fourSeat])).rows.map(row => row.user_id);
    const loserIds = GROUP.map(person => person.id).filter(id => !winnerIds.includes(id));
    assert.equal(loserIds.length, 4);
    await Promise.all(loserIds.map(id => rsvpAs(id, fourSeat, 'maybe')));
    await Promise.all(winnerIds.flatMap(id => [rsvpAs(id, fourSeat, 'going'), rsvpAs(id, fourSeat, 'going')]));
    await as(ORGANIZER.id);
    assert.equal(await goingRows(fourSeat), 4);
    assert.equal(await count('palau_rsvps', `where activity_id='${fourSeat}'`), 8, 'one row per person, no duplicates');
    assert.equal(await count('palau_rsvps', `where activity_id='${fourSeat}' and response='maybe'`), 4);
    for (const id of loserIds) await assert.rejects(rsvpAs(id, fourSeat, 'going'), /Activity full/);
  });

  await check('declining frees a seat for the next traveler; the seat after that is still refused', async () => {
    await as(ORGANIZER.id);
    const [winner] = (await run("select user_id from palau_rsvps where activity_id=$1 and response='going' order by user_id", [fourSeat])).rows.map(row => row.user_id);
    const [nextA, nextB] = (await run("select user_id from palau_rsvps where activity_id=$1 and response='maybe' order by user_id", [fourSeat])).rows.map(row => row.user_id);
    await rsvpAs(winner, fourSeat, 'not_going');
    await as(ORGANIZER.id); assert.equal(await goingRows(fourSeat), 3);
    await rsvpAs(nextA, fourSeat, 'going');
    await assert.rejects(rsvpAs(nextB, fourSeat, 'going'), /Activity full/);
    await as(ORGANIZER.id); assert.equal(await goingRows(fourSeat), 4);
    await assert.rejects(run('update palau_activities set capacity=3 where id=$1', [fourSeat]), /Capacity below going count/);
  });

  await check('an uncapped activity accepts all eight', async () => {
    await Promise.all(GROUP.map(person => rsvpAs(person.id, openDinner, 'going')));
    await as(ORGANIZER.id); assert.equal(await goingRows(openDinner), 8);
  });

  await check('revoking a seated traveler frees the seat and the revoked identity is denied everywhere', async () => {
    await as(ORGANIZER.id);
    // Make sure the traveler about to be revoked holds a seat, whoever won the earlier race.
    const seated = (await run("select user_id from palau_rsvps where activity_id=$1 and response='going' order by user_id", [fourSeat])).rows.map(row => row.user_id);
    if (!seated.includes(revoked.id)) {
      await rsvpAs(seated.find(id => id !== revoked.id), fourSeat, 'not_going');
      await rsvpAs(revoked.id, fourSeat, 'going');
    }
    await as(ORGANIZER.id);
    assert.equal(await effectiveGoing(fourSeat), 4);
    await run('select palau_revoke_member($1,$2)', [trip, revoked.id]);
    assert.equal(await count('palau_members', 'where revoked_at is null'), 7);
    assert.equal(await goingRows(fourSeat), 4, 'the stale Going row remains in the table');
    assert.equal(await effectiveGoing(fourSeat), 3, 'but a revoked member no longer occupies a seat');
    const waiting = (await run("select user_id from palau_rsvps where activity_id=$1 and response<>'going' and user_id<>$2 order by user_id limit 1", [fourSeat, revoked.id])).rows[0].user_id;
    await rsvpAs(waiting, fourSeat, 'going');
    await as(ORGANIZER.id);
    assert.equal(await effectiveGoing(fourSeat), 4);
    assert.equal(await goingRows(fourSeat), 5, 'raw rows include the revoked member; readers must join active membership');
    await as(revoked.id);
    for (const table of ['palau_trips', 'palau_members', 'palau_arrivals', 'palau_travel_details', 'palau_checklist', 'palau_activities', 'palau_rsvps', 'palau_journal', 'storage.objects']) assert.equal(await count(table), 0, `${table} hidden after revocation`);
    await assert.rejects(run('select palau_set_rsvp($1,$2)', [fourSeat, 'maybe']), /Not authorized/);
    await assert.rejects(run("insert into palau_checklist(trip_id,owner_id,visibility,title) values($1,$2,'personal','Denied')", [trip, revoked.id]), /row-level security/);
    await assert.rejects(run("insert into palau_journal(trip_id,user_id,body) values($1,$2,'Denied')", [trip, revoked.id]), /row-level security/);
    await assert.rejects(run("insert into storage.objects(bucket_id,name) values('palau-private',$1)", [`${trip}/${revoked.id}/denied.jpg`]), /row-level security/);
    await as(ORGANIZER.id);
    const reinvite = (await run('select palau_create_invite($1,$2) token', [trip, revoked.email])).rows[0].token;
    await as(revoked.id);
    await assert.rejects(run('select palau_accept_invite($1,$2)', [reinvite, revoked.name]), /Invitation unavailable/, 'a revoked member cannot re-enter through a new invitation');
    await as(ORGANIZER.id);
    assert.equal(await count('palau_members', 'where revoked_at is null'), 7);
  });

  await check('journal and media: members read each other, mutate only their own, organizer moderates linked media only', async () => {
    const authors = TRAVELERS.slice(0, 3);
    for (const author of authors) {
      await as(author.id);
      const path = `${trip}/${author.id}/memory.jpg`;
      await run("insert into storage.objects(bucket_id,name) values('palau-private',$1)", [path]);
      await run("insert into palau_journal(trip_id,user_id,body,media_path) values($1,$2,$3,$4)", [trip, author.id, `Synthetic memory by ${author.name}`, path]);
      await run("insert into storage.objects(bucket_id,name) values('palau-private',$1)", [`${trip}/${author.id}/unlinked.jpg`]);
    }
    const reader = TRAVELERS[3];
    await as(reader.id);
    assert.equal(await count('palau_journal'), 3);
    assert.equal(await count('storage.objects'), 6, 'members can read all pilot media for their trip');
    assert.equal((await run('delete from palau_journal returning id')).rows.length, 0, 'cannot delete other authors\' entries');
    assert.equal((await run("update palau_journal set body='Denied' returning id")).rows.length, 0);
    assert.equal((await run("delete from storage.objects where bucket_id='palau-private' returning id")).rows.length, 0);
    await assert.rejects(run("insert into storage.objects(bucket_id,name) values('palau-private',$1)", [`${trip}/${authors[0].id}/spoof.jpg`]), /row-level security/);
    await assert.rejects(run("insert into palau_journal(trip_id,user_id,body,media_path) values($1,$2,'Spoof',$3)", [trip, reader.id, `${trip}/${authors[0].id}/memory.jpg`]), /check constraint|row-level security/);
    await assert.rejects(run("insert into palau_journal(trip_id,user_id,body) values($1,$2,'Spoof')", [trip, authors[0].id]), /row-level security/);
    await as(ORGANIZER.id);
    assert.equal(await count('palau_journal'), 3);
    assert.equal((await run("delete from storage.objects where name=$1 returning id", [`${trip}/${authors[0].id}/unlinked.jpg`])).rows.length, 0, 'organizer cannot remove unlinked member uploads');
    assert.equal((await run("delete from storage.objects where name=$1 returning id", [`${trip}/${authors[0].id}/memory.jpg`])).rows.length, 1, 'organizer may moderate linked media');
    assert.equal((await run("delete from palau_journal where user_id=$1 returning id", [authors[0].id])).rows.length, 1);
    await as(OUTSIDER.id); assert.equal(await count('palau_journal'), 0); assert.equal(await count('storage.objects'), 0);
    await as(revoked.id); assert.equal(await count('storage.objects'), 0);
    await as(null, 'anon'); assert.equal(await count('storage.objects'), 0);
    await assert.rejects(run("insert into storage.objects(bucket_id,name) values('palau-private','spoof')"), /row-level security/);
  });

  await check('group size is a coordination expectation, not a database limit (documented gap)', async () => {
    // The migration enforces membership and capacity, not a maximum roster. A ninth verified identity could be invited.
    await as(ORGANIZER.id);
    const ninth = (await run('select palau_create_invite($1,$2) token', [trip, OUTSIDER.email])).rows[0].token;
    assert.match(ninth, /^[a-f0-9]{64}$/);
    await run('select palau_revoke_invites($1)', [trip]);
    await as(OUTSIDER.id);
    await assert.rejects(run('select palau_accept_invite($1,$2)', [ninth, OUTSIDER.name]), /Invitation unavailable/);
    await as(ORGANIZER.id);
    assert.equal(await count('palau_members', 'where revoked_at is null'), 7);
  });
});
await db.close();
