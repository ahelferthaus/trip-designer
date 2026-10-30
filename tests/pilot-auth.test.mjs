import test from 'node:test';
import assert from 'node:assert/strict';
import { createPilotAuthAction, pilotReturnPath, pilotToken, pilotDestination } from '../src/lib/pilotAuth.ts';

const token = 'a'.repeat(64);
const trip = '/pilot/private/10000000-0000-4000-8000-000000000001';
const ready = { data: { session: {}, user: { email_confirmed_at: '2030-01-01', is_anonymous: false } }, error: null };
function mock(answer = ready) {
  const calls = [];
  return { calls, auth: { signInWithPassword: async args => { calls.push(args); return typeof answer === 'function' ? answer() : answer; }, signUp: async args => { calls.push(args); return answer; } } };
}
test('return targets reject external, encoded, query, fragment and legacy destinations', () => {
  for (const path of ['https://evil.example','//evil.example','/auth','/home','/pilot/invite?next=//evil.example','/pilot/invite#token=x','/%2f%2fevil.example',null]) assert.equal(pilotReturnPath(path), '/pilot/invite');
  assert.equal(pilotReturnPath(trip), trip);
  assert.equal(pilotDestination('/pilot/invite', token), `/pilot/invite#token=${token}`);
  assert.equal(pilotDestination(trip, token), trip);
  assert.equal(pilotToken('#token=invalid'), '');
  assert.equal(pilotToken(`#token=${token}`), token);
});
test('empty credentials and short signup passwords never reach Auth', async () => {
  const c = mock(); const a = createPilotAuthAction();
  for (const args of [['','p',false],['a@example.test','',false],['a@example.test','short',true]]) assert.equal((await a.run(c,...args,'https://example.test/pilot/sign-in')).status,'invalid');
  assert.equal(c.calls.length,0);
});
test('repeated submissions share one pending operation and retry after failure is possible', async () => {
  let resolve; const c = mock(() => new Promise(r => { resolve=r; })); const a=createPilotAuthAction();
  const first=a.run(c,'a@example.test','password',false,'');
  assert.equal((await a.run(c,'a@example.test','password',false,'')).status,'ignored');
  resolve({error:{message:'private backend detail'},data:{}});
  assert.equal((await first).status,'error'); assert.equal(c.calls.length,1);
  const retry=a.run(c,'a@example.test','password',false,''); resolve(ready); assert.equal((await retry).status,'ready');
});
test('leaving/back/forward cancellation discards stale success and errors', async () => {
  for (const response of [ready,{error:{message:'failure'},data:{}}]) {
    let resolve; const a=createPilotAuthAction(); const c=mock(()=>new Promise(r=>{resolve=r;}));
    const old=a.run(c,'a@example.test','password',false,''); a.cancel(); resolve(response);
    assert.equal((await old).status,'ignored');
    assert.equal((await a.run(mock(),'a@example.test','password',false,'')).status,'ready');
  }
});
test('confirmed nonanonymous identity and session are required before return', async () => {
  for (const answer of [{data:{session:null,user:{}},error:null},{data:{session:{},user:{email_confirmed_at:null}},error:null},{data:{session:{},user:{email_confirmed_at:'x',is_anonymous:true}},error:null}]) {
    assert.equal((await createPilotAuthAction().run(mock(answer),'a@example.test','password',false,'')).status,'confirm');
  }
});
test('signup uses explicit callback and never carries invitation tokens in email redirect', async () => {
  const c=mock({data:{session:null,user:{}},error:null});
  assert.equal((await createPilotAuthAction().run(c,' a@example.test ','password',true,'https://example.test/pilot/sign-in')).status,'confirm');
  assert.deepEqual(c.calls[0].options,{emailRedirectTo:'https://example.test/pilot/sign-in'});
});
test('network failure becomes recoverable generic error', async () => {
  assert.equal((await createPilotAuthAction().run(mock(()=>{throw Error('network');}),'a@example.test','password',false,'')).status,'error');
});
