/** Opt-in disposable LOCAL PostgreSQL runner. Never accepts a remote DB URL.
 * Requires approved binaries via POSTGRES_TEST_BIN. No service or PATH changes.
 * Synthetic cluster is preserved, stopped, and its ephemeral password is not logged.
 */
import { spawn } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createServer } from 'node:net';
import assert from 'node:assert/strict';

const bin = process.env.POSTGRES_TEST_BIN;
assert.ok(bin, 'Set POSTGRES_TEST_BIN to the approved local PostgreSQL bin directory');
const root = resolve(import.meta.dirname, '../..', 'postgres-test-data');
const cluster = join(root, randomUUID());
await mkdir(cluster, { recursive: true });
const password = randomBytes(32).toString('hex');
const pwfile = join(cluster, 'init-password.local');
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^PG/i.test(key)));
// Never inherit a remote hostaddr, service, password file or libpq option.
Object.assign(env, { PGPASSWORD: password, PGCONNECT_TIMEOUT: '5', PGSSLMODE: 'disable' });
const server = createServer();
await new Promise((ok, fail) => server.once('error', fail).listen(0, '127.0.0.1', ok));
const port = server.address().port;
await new Promise(ok => server.close(ok));
function command(name, args, input = '') {
  return new Promise((ok, fail) => {
    const proc = spawn(join(bin, `${name}.exe`), args, { env, windowsHide: true, stdio: ['pipe','pipe','pipe'] });
    let stdout = '', stderr = '';
    proc.stdout.on('data', b => stdout += b); proc.stderr.on('data', b => stderr += b);
    proc.on('error', fail);
    // On Windows the background postmaster can retain pg_ctl pipe handles.
    // Its exit status, not pipe closure, is the lifecycle command completion.
    proc.on(name === 'pg_ctl' ? 'exit' : 'close', code => ok({ code, stdout, stderr }));
    proc.stdin.on('error', () => {}); proc.stdin.end(input);
  });
}
const sql = text => command('psql', ['-X','-q','-A','-t','-v','ON_ERROR_STOP=1','-h','127.0.0.1','-p',String(port),'-U','vybr_test','-d','postgres'], text);
async function query(text) {
  const r = await sql(text); assert.equal(r.code, 0, r.stderr); return r.stdout.trim();
}
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const org=uid(1), member=uid(2), outsider=uid(3);
const as = (user, name, body, hold = false) => `begin isolation level read committed; set local statement_timeout='15s'; set local application_name=${quote(name)}; set local "request.jwt.claim.sub"=${quote(user)}; set local role authenticated; ${body}; ${hold ? 'select pg_sleep(5);' : ''} commit;`;
const create = (req, owner=org) => `select public.vybr_create_trip(${quote(req)},'Synthetic concurrent trip','Test destination','2030-04-01','2030-04-10','UTC',2,'Test organizer',${quote(owner)})`;
const first = result => result.split(/\r?\n/).find(line => /^[a-f0-9-]{36}$/.test(line));
async function observe(name, blocked = false) {
  for (let n=0; n<35; n++) {
    const text=await query(`select coalesce(json_agg(json_build_object('pid',pid,'blocking',pg_blocking_pids(pid),'event',wait_event)),'[]') from pg_stat_activity where application_name=${quote(name)} and state='active';`);
    const rows=JSON.parse(text);
    if (rows.length && (blocked ? rows[0].blocking.length : rows[0].event === 'PgSleep')) return rows[0];
    await new Promise(ok=>setTimeout(ok,80));
  }
  throw new Error(`No ${blocked ? 'blocked' : 'holding'} transaction observed for ${name}`);
}
const evidence=[];
async function race(label, left, right, reject = false) {
  const a = sql(left);
  const holding = await observe(`${label}_a`);
  const b = sql(right);
  const waiting = await observe(`${label}_b`, true);
  assert.notEqual(holding.pid, waiting.pid); assert.ok(waiting.blocking.includes(holding.pid));
  const [ra,rb]=await Promise.all([a,b]);
  assert.equal(ra.code,0,ra.stderr);
  if (reject) { assert.notEqual(rb.code,0); assert.match(rb.stderr,reject instanceof RegExp ? reject : /Trip participant limit reached/); }
  else assert.equal(rb.code,0,rb.stderr);
  evidence.push({test:label,connections:[holding.pid,waiting.pid],observedBlocking:true,loserRejected:Boolean(reject)});
  return [ra.stdout.trim(),rb.stdout.trim()];
}
let started=false;
try {
  await writeFile(pwfile,password,{flag:'wx'});
  const init=await command('initdb',['-D',join(cluster,'data'),'-U','vybr_test','--auth=scram-sha-256',`--pwfile=${pwfile}`,'--encoding=UTF8','--locale=C']);
  assert.equal(init.code,0,init.stderr);
  await unlink(pwfile);
  const start=await command('pg_ctl',['-D',join(cluster,'data'),'-l',join(cluster,'server.log'),'-o',`-h 127.0.0.1 -p ${port}`,'-w','start']);
  assert.equal(start.code,0,start.stderr); started=true;
  assert.equal(await query('show listen_addresses'),'127.0.0.1');
  const source=await readFile(new URL('../supabase/tests/general-trip-foundation.rls.test.mjs',import.meta.url),'utf8');
  const bootstrap=source.match(/await db\.exec\(`\r?\n( create role anon;[\s\S]*?)`\);/)?.[1];
  assert.ok(bootstrap, 'Synthetic schema bootstrap must be found explicitly');
  await query(bootstrap);
  await query(`insert into auth.users(id,email,email_confirmed_at,is_anonymous) values (${quote(org)},'organizer@example.test',now(),false),(${quote(member)},'member@example.test',now(),false),(${quote(outsider)},'outsider@example.test',now(),false);`);
  const candidate = process.env.POSTGRES_TEST_LOCK_CANDIDATE === 'true';
  for (const file of ['20261027161432_palau_private_pilot.sql','20261031060000_palau_member_restore.sql','20261031071157_general_trip_foundation.sql']) {
    let migration=await readFile(new URL(`../supabase/migrations/${file}`,import.meta.url),'utf8');
    await query(migration);
  }
  if (candidate) await query(await readFile(new URL('../supabase/migrations/20261031133442_participant_limit_lock_compatibility.sql',import.meta.url),'utf8'));

  const [a,b]=await race('idempotency',as(org,'idempotency_a',create(uid(100)),true),as(org,'idempotency_b',create(uid(100))));
  const trip=first(a); assert.ok(trip); assert.equal(first(b),trip);
  assert.equal(await query(`select count(*) from palau_private.trip_creation_requests where request_id=${quote(uid(100))}`),'1');
  assert.equal(await query(`select count(*) from palau_members where trip_id=${quote(trip)} and user_id=${quote(org)} and role='organizer'`),'1');

  const [rolled, retried]=await race('creator_rollback',as(org,'creator_rollback_a',create(uid(110)),true).replace('commit;','rollback;'),as(org,'creator_rollback_b',create(uid(110))));
  assert.notEqual(first(rolled),first(retried));
  assert.equal(await query(`select count(*) from palau_trips where id=${quote(first(rolled))}`),'0');
  assert.equal(await query(`select count(*) from palau_private.trip_creation_requests where request_id=${quote(uid(110))}`),'1');
  await race('conflicting_retry',as(org,'conflicting_retry_a',create(uid(111)),true),as(org,'conflicting_retry_b',create(uid(111)).replace('Synthetic concurrent trip','Different trip')),/different trip details/);

  const own = sql(as(org,'ownership_a',create(uid(101)),true));
  const holding=await observe('ownership_a');
  const wrong=await sql(as(outsider,'ownership_b',create(uid(101),org)));
  assert.notEqual(wrong.code,0); assert.match(wrong.stderr,/Account changed/);
  const other=first(await query(as(outsider,'ownership_c',create(uid(101),outsider))));
  const ownResult=await own; assert.equal(ownResult.code,0,ownResult.stderr); assert.notEqual(first(ownResult.stdout),other);
  assert.equal(await query(`select count(*) from palau_private.trip_creation_requests r join palau_members m on m.trip_id=r.trip_id and m.user_id=r.user_id where r.request_id=${quote(uid(101))} and m.role='organizer'`),'2');
  evidence.push({test:'ownership',ownerConnection:holding.pid,wrongExpectedAccountRejected:true,distinctOwnerTrips:true});

  const tokenA=await query(as(org,'invite_setup',`select palau_create_invite(${quote(trip)},'member@example.test')`));
  const tokenB=await query(as(org,'invite_setup',`select palau_create_invite(${quote(trip)},'outsider@example.test')`));
  await race('final_slot',as(member,'final_slot_a',`select palau_accept_invite(${quote(tokenA)},'Traveler')`,true),as(outsider,'final_slot_b',`select palau_accept_invite(${quote(tokenB)},'Other')`),true);
  assert.equal(await query(`select count(*) from palau_members where trip_id=${quote(trip)} and revoked_at is null`),'2');
  assert.equal(await query(`select count(*) from palau_private.invitations where trip_id=${quote(trip)} and invited_email='outsider@example.test' and accepted_at is null and revoked_at is null`),'1');

  const restoreTrip=first(await query(as(org,'restore_setup',create(uid(102)))));
  await query(`insert into palau_members(trip_id,user_id,display_name,role,revoked_at) values (${quote(restoreTrip)},${quote(member)},'Traveler','traveler',now()),(${quote(restoreTrip)},${quote(outsider)},'Other','traveler',now());`);
  await race('restore',as(org,'restore_a',`select palau_restore_member(${quote(restoreTrip)},${quote(member)})`,true),as(org,'restore_b',`select palau_restore_member(${quote(restoreTrip)},${quote(outsider)})`),true);
  assert.equal(await query(`select count(*) from palau_members where trip_id=${quote(restoreTrip)} and revoked_at is null`),'2');
  assert.equal(await query(`select count(*) from palau_members where trip_id=${quote(restoreTrip)} and user_id=${quote(outsider)} and revoked_at is not null`),'1');

  for (const restoreFirst of [true,false]) {
    const label=restoreFirst?'restore_accept':'accept_restore';
    const t=first(await query(as(org,`${label}_setup`,create(restoreFirst?uid(112):uid(113)))));
    await query(`insert into palau_members(trip_id,user_id,display_name,role,revoked_at) values (${quote(t)},${quote(member)},'Traveler','traveler',now());`);
    const token=await query(as(org,`${label}_invite`,`select palau_create_invite(${quote(t)},'outsider@example.test')`));
    const restore=`select palau_restore_member(${quote(t)},${quote(member)})`;
    const accept=`select palau_accept_invite(${quote(token)},'Other')`;
    await race(label,as(restoreFirst?org:outsider,`${label}_a`,restoreFirst?restore:accept,true),as(restoreFirst?outsider:org,`${label}_b`,restoreFirst?accept:restore),true);
    assert.equal(await query(`select count(*) from palau_members where trip_id=${quote(t)} and revoked_at is null`),'2');
  }

  // Composed transactions may already hold a parent FK-compatible KEY SHARE lock.
  // Reproduce the review's lock-upgrade concern without touching hosted code.
  const lockTrip=first(await query(as(org,'lock_setup',create(uid(114)))));
  await query(`insert into palau_members(trip_id,user_id,display_name,role,revoked_at) values (${quote(lockTrip)},${quote(member)},'Traveler','traveler',now()),(${quote(lockTrip)},${quote(outsider)},'Other','traveler',now());`);
  const lockCall=(name,who)=>as(org,name,`select id from palau_trips where id=${quote(lockTrip)} for key share; select pg_sleep(3); select palau_restore_member(${quote(lockTrip)},${quote(who)})`);
  const la=sql(lockCall('lock_upgrade_a',member)); const lockA=await observe('lock_upgrade_a');
  const lb=sql(lockCall('lock_upgrade_b',outsider)); const lockB=await observe('lock_upgrade_b');
  assert.notEqual(lockA.pid,lockB.pid);
  const locks=await Promise.all([la,lb]);
  const deadlock=locks.some(r=>/deadlock detected/.test(r.stderr));
  assert.equal(locks.filter(r=>r.code===0).length,1);
  assert.equal(await query(`select count(*) from palau_members where trip_id=${quote(lockTrip)} and revoked_at is null`),'2');
  if(candidate) { assert.equal(deadlock,false); assert.ok(locks.some(r=>/Trip participant limit reached/.test(r.stderr))); }
  else assert.equal(deadlock,true,'Expected reproduction must be revisited if baseline locking changes');
  evidence.push({test:'composed_lock_upgrade',connections:[lockA.pid,lockB.pid],deadlockReproduced:deadlock,capacityPreserved:true});
  const status=candidate?'PASS_LOCAL_CANDIDATE':'NORMAL_RPC_RACES_PASS_LOCK_UPGRADE_DEFECT_REPRODUCED';
  await writeFile(join(cluster,'results.json'),JSON.stringify({version:await query('show server_version'),candidate,evidence},null,2));
  console.log(JSON.stringify({status,tests:evidence,cluster},null,2));
} finally {
  await unlink(pwfile).catch(e=>{if(e.code!=='ENOENT')throw e;});
  if (started) {
    const stop=await command('pg_ctl',['-D',join(cluster,'data'),'-m','fast','-w','stop']);
    assert.equal(stop.code,0,stop.stderr); console.log('Local test server stopped. Synthetic cluster preserved.');
  }
}
