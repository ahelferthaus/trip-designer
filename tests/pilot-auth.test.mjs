import test from 'node:test';
import assert from 'node:assert/strict';
import { createPilotAuthAction, pilotReturnPath, pilotToken, pilotDestination, pilotCallback } from '../src/lib/pilotAuth.ts';

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
test('network failure asks users to wait instead of repeating signup', async () => {
  assert.equal((await createPilotAuthAction().run(mock(()=>{throw Error('network');}),'a@example.test','password',false,'')).status,'retry_later');
});
test('token case matches server acceptance and malformed UUID return paths fail closed', () => {
  assert.equal(pilotToken(`#token=${'A'.repeat(64)}`), '');
  assert.equal(pilotDestination('/pilot/invite','A'.repeat(64)), '/pilot/invite');
  assert.equal(pilotReturnPath(`/pilot/private/${'-'.repeat(36)}`), '/pilot/invite');
});
test('confirmation-required error is actionable while other Auth errors stay generic', async () => {
  for(const [code,status] of [['email_not_confirmed','confirm'],['invalid_credentials','error']]) {
    assert.equal((await createPilotAuthAction().run(mock({data:{},error:{code}}),'a@example.test','password',false,'')).status,status);
  }
});
test('callback cleanup removes sensitive parameters and detects expiry without displaying server text', () => {
  const result=pilotCallback('?next=%2Fpilot%2Finvite&code=sample-code&error_description=private-message&access_token=sample-access&refresh_token=sample-refresh','#error_code=otp_expired');
  assert.deepEqual(result,{search:'?next=%2Fpilot%2Finvite',failed:true,hadCode:true});
  assert.deepEqual(pilotCallback('','#token='+token),{search:'',failed:false,hadCode:false});
});

test('rate limits and password policy failures provide safe distinct guidance', async () => {
  for (const [code, status] of [['over_request_rate_limit','retry_later'],['over_email_send_rate_limit','retry_later'],['weak_password','weak_password']]) {
    const c = mock({ data: {}, error: { code, message: 'do not expose backend text' } });
    assert.deepEqual(await createPilotAuthAction().run(c,'a@example.test','password',true,''), { status });
    assert.equal(c.calls.length,1);
  }
  assert.equal(pilotCallback('?code=example', '').hadCode, true);
});

test('dashboard is an allowed internal return path but arbitrary routes remain rejected',()=>{
 assert.equal(pilotReturnPath('/pilot/trips'),'/pilot/trips');
 assert.equal(pilotReturnPath('/pilot/trips?next=https://evil.example'),'/pilot/invite');
});

// Synthetic SDK responses: no real accounts, credentials, or requests.
function callbackClient(kind = null) {
 const user={id:'synthetic-user',email_confirmed_at:'2030-01-01',is_anonymous:false};
 let session=null; const calls={exchange:0,verify:0,clear:0};
 const auth={
  exchangeCodeForSession:async()=>{calls.exchange++;session={access_token:'synthetic-exchanged'};return {data:{session,user,redirectType:kind},error:null};},
  getUser:async token=>{assert.equal(token,'synthetic-exchanged');calls.verify++;return {data:{user},error:null};},
  getSession:async()=>({data:{session},error:null}),
  signOut:async args=>{assert.deepEqual(args,{scope:'local'});calls.clear++;session=null;return {error:null};}
 };
 return {auth,calls,user,replaceSession:value=>{session=value;}};
}

test('confirmation verifies exchanged identity and rejects invalid identities with cleanup',async()=>{
 const {exchangePilotConfirmation}=await import('../src/lib/pilotAuth.ts');
 const c=callbackClient();assert.equal(await exchangePilotConfirmation(c,'code'),true);assert.equal(c.calls.exchange,1);
 for(const user of [null,{...c.user,id:'other'},{...c.user,email_confirmed_at:null},{...c.user,is_anonymous:true}]){
  const client=callbackClient();client.auth.getUser=async()=>({data:{user},error:null});
  assert.equal(await exchangePilotConfirmation(client,'code'),false);assert.equal(client.calls.clear,1);
 }
});
test('confirmation rejects recovery, expired and oversized codes without leaking errors',async()=>{
 const {exchangePilotConfirmation}=await import('../src/lib/pilotAuth.ts');
 const c=callbackClient('PASSWORD_RECOVERY');
 assert.equal(await exchangePilotConfirmation(c,''),false);assert.equal(await exchangePilotConfirmation(c,'x'.repeat(2049)),false);assert.equal(c.calls.exchange,0);
 assert.equal(await exchangePilotConfirmation(c,'code'),false);assert.equal(c.calls.clear,1);assert.equal(c.calls.verify,0);
 c.auth.exchangeCodeForSession=async()=>{throw Error('private detail')};assert.equal(await exchangePilotConfirmation(c,'expired'),false);
});
test('cleanup failure blocks completion and cannot be mistaken for normal invalid link',async()=>{
 const {exchangePilotConfirmation,PilotCallbackCleanupError}=await import('../src/lib/pilotAuth.ts');
 for(const failure of ['error','retained']){
  const c=callbackClient('PASSWORD_RECOVERY');c.auth.signOut=async()=>({error:failure==='error'?{message:'private detail'}:null});
  await assert.rejects(exchangePilotConfirmation(c,'code'),PilotCallbackCleanupError);
 }
});
test('session switch is not cleared or treated as completion',async()=>{
 const {exchangePilotConfirmation}=await import('../src/lib/pilotAuth.ts');
 const c=callbackClient();c.auth.getUser=async()=>{c.replaceSession({access_token:'different-session'});return {data:{user:c.user},error:null};};
 assert.equal(await exchangePilotConfirmation(c,'code'),false);assert.equal(c.calls.clear,0);
});
test('verification retries do not repeat one-use exchange and thrown verification cleans session',async()=>{
 const {exchangePilotConfirmation}=await import('../src/lib/pilotAuth.ts');
 const c=callbackClient();let attempts=0;c.auth.getUser=async()=>++attempts===1?{data:{user:null},error:{}}:{data:{user:c.user},error:null};
 assert.equal(await exchangePilotConfirmation(c,'code'),true);assert.equal(c.calls.exchange,1);assert.equal(attempts,2);
 c.auth.getUser=async()=>{throw Error('network')};assert.equal(await exchangePilotConfirmation(c,'code'),false);assert.equal(c.calls.clear,1);
});
test('delayed rejected exchange still clears its session after consumer stops waiting',async()=>{
 const {exchangePilotConfirmation}=await import('../src/lib/pilotAuth.ts');
 const c=callbackClient('PASSWORD_RECOVERY');const original=c.auth.exchangeCodeForSession;let release;
 c.auth.exchangeCodeForSession=()=>new Promise(resolve=>{release=async()=>resolve(await original());});
 const pending=exchangePilotConfirmation(c,'code');await release();
 assert.equal(await pending,false);assert.equal(c.calls.clear,1);
});
