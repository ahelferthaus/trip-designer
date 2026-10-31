import test from 'node:test';
import assert from 'node:assert/strict';
import { requestJourneyPhoto } from '../src/lib/journeyPhotoRequest.ts';
const settle = () => new Promise(resolve => setImmediate(resolve));
function clock() {
  let expire; let cleared = false;
  return { schedule: callback => { expire = callback; return () => { cleared = true; }; }, expire: () => expire(), cleared: () => cleared };
}
test('photo lease expires without background retries and discards a late signed response', async () => {
  let resolve; let calls = 0; const states = []; const c = clock();
  requestJourneyPhoto(() => { calls++; return new Promise(r => { resolve = r; }); }, s => states.push(s), c.schedule);
  await settle(); c.expire(); resolve('synthetic-signed-url'); await settle();
  assert.deepEqual(states, [{kind:'loading'}, {kind:'expired'}]); assert.equal(calls, 1);
});
test('photo cleanup prevents obsolete account/path responses and clears expiry', async () => {
  let resolve; const states = []; const c = clock();
  const cancel = requestJourneyPhoto(() => new Promise(r => { resolve = r; }), s => states.push(s), c.schedule);
  await settle(); cancel(); resolve('old-account-url'); await settle(); c.expire();
  assert.deepEqual(states, [{kind:'loading'}]); assert.equal(c.cleared(), true);
});
test('photo access failure is visible, does not leak errors, and explicit retry obtains a fresh lease', async () => {
  const states=[]; const c=clock();
  requestJourneyPhoto(async () => { throw new Error('sensitive backend detail'); }, s=>states.push(s), c.schedule);
  await settle(); assert.deepEqual(states, [{kind:'loading'}, {kind:'unavailable'}]); assert.equal(c.cleared(),true);
  const retryClock=clock();
  const cancel=requestJourneyPhoto(async ()=>'new-synthetic-url', s=>states.push(s), retryClock.schedule);
  await settle(); assert.deepEqual(states.at(-1), {kind:'ready',url:'new-synthetic-url'});
  retryClock.expire(); assert.deepEqual(states.at(-1), {kind:'expired'}); cancel();
});
test('immediate cancellation never issues the underlying request', async () => {
  let calls=0; const c=clock();
  requestJourneyPhoto(async()=>{calls++;return 'url';},()=>{},c.schedule)();
  await settle(); assert.equal(calls,0);
});
test('delayed timers cannot allow an already expired response to display', async () => {
  let resolve; let time=100; const states=[]; const c=clock();
  requestJourneyPhoto(()=>new Promise(r=>{resolve=r;}),s=>states.push(s),c.schedule,()=>time);
  await settle(); time+=55_001; resolve('expired-url'); await settle();
  assert.deepEqual(states,[{kind:'loading'},{kind:'expired'}]); assert.equal(c.cleared(),true);
});
