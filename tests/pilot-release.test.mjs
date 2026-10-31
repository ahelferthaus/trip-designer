import test from 'node:test';
import assert from 'node:assert/strict';
import { createPilotInvitation, requestPilotRecovery, exchangePilotRecovery, updatePilotRecoveredPassword } from '../src/lib/pilotRelease.ts';
const id = '10000000-0000-4000-8000-000000000001';
const user = { id, email_confirmed_at: '2030-01-01', is_anonymous: false };
function mock(role = 'organizer') {
  const calls = [];
  return { calls, auth: { getUser: async () => ({ data: { user }, error: null }) },
    from(table) { const q = { select(){return q;}, eq(){return q;}, async maybeSingle(){return {data:table==='palau_members'?{role,revoked_at:null}:{id},error:null};} };return q; },
    async rpc(name,args){calls.push({name,args});return {data:'a'.repeat(64),error:null};} };
}
test('invite requires server-verified organizer, validates email and returns fragment-only token', async()=>{
  const denied=mock('traveler'); await assert.rejects(createPilotInvitation(denied,id,'person@example.test','https://app.example'),/Organizer/); assert.equal(denied.calls.length,0);
  const c=mock(); await assert.rejects(createPilotInvitation(c,id,'invalid','https://app.example')); assert.equal(c.calls.length,0);
  const r=await createPilotInvitation(c,id,' Person@Example.test ','https://app.example');
  assert.deepEqual(c.calls,[{name:'palau_create_invite',args:{p_trip:id,p_email:'person@example.test'}}]);
  const url=new URL(r.link); assert.equal(url.pathname,'/pilot/invite');assert.equal(url.search,'');assert.equal(url.hash,'#token='+'a'.repeat(64));
});
test('recovery uses fixed same-origin route and hides account existence', async()=>{
  let captured; const c={auth:{resetPasswordForEmail:async(...args)=>{captured=args;return {error:null};}}};
  assert.equal(await requestPilotRecovery(c,'bad','https://app.example'),'invalid');assert.equal(captured,undefined);
  assert.equal(await requestPilotRecovery(c,'person@example.test','https://app.example'),'sent');
  assert.deepEqual(captured,['person@example.test',{redirectTo:'https://app.example/pilot/recover'}]);
  c.auth.resetPasswordForEmail=async()=>({error:{status:429,message:'backend detail'}});assert.equal(await requestPilotRecovery(c,'person@example.test','https://app.example'),'limited');
});
test('only exchanged recovery sessions enable password update, never ordinary signup codes', async()=>{
  let cleared=0;
  const c={auth:{signOut:async args=>{assert.deepEqual(args,{scope:'local'});cleared++;},exchangeCodeForSession:async()=>({data:{session:{},user,redirectType:'signup'},error:null})}};
  assert.equal(await exchangePilotRecovery(c,'code'),null);
  assert.equal(cleared,1);
  c.auth.exchangeCodeForSession=async()=>({data:{session:{},user,redirectType:'recovery'},error:null});assert.equal(await exchangePilotRecovery(c,'code'),null);
  c.auth.exchangeCodeForSession=async()=>({data:{session:{},user,redirectType:'PASSWORD_RECOVERY'},error:null});assert.equal(await exchangePilotRecovery(c,'code'),id);
  assert.equal(await exchangePilotRecovery(c,''),null);
});
test('password update rejects identity switches, missing recovery and mismatched passwords', async()=>{
  const c=mock();let updates=0;c.auth.updateUser=async()=>{updates++;return {error:null};};
  assert.equal(await updatePilotRecoveredPassword(c,null,'password123','password123'),'invalid');
  assert.equal(await updatePilotRecoveredPassword(c,id,'password123','mismatch'),'invalid');
  assert.equal(await updatePilotRecoveredPassword(c,'different-user','password123','password123'),'invalid');assert.equal(updates,0);
  assert.equal(await updatePilotRecoveredPassword(c,id,'password123','password123'),'updated');assert.equal(updates,1);
});
