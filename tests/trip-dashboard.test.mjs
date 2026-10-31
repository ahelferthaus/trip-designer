import test from 'node:test';
import assert from 'node:assert/strict';
import { attemptForUser, createGeneralTrip, loadTripDashboard, TripRejectedError, validateTripDraft } from '../src/lib/tripDashboard.ts';
import { tripDateTimeInput, tripDateTimeToIso } from '../src/lib/privateTripPresentation.ts';
const id='10000000-0000-4000-8000-000000000001', trip='20000000-0000-4000-8000-000000000001';
const user={id,email_confirmed_at:'2030-01-01',is_anonymous:false};
const draft={title:'Any journey',destination:'Tokyo',start:'2030-04-01',end:'2030-04-10',timeZone:'Asia/Tokyo',participantLimit:8,displayName:'Organizer'};
function mock({users=[user,user],members=[{trip_id:trip,role:'organizer'}],current=members,tripError=null,rpcError=null,rpcData=trip}={}) {
 let authCalls=0, memberCalls=0;const calls=[];
 const c={calls,auth:{getUser:async()=>({data:{user:users[Math.min(authCalls++,users.length-1)]},error:null})},rpc:async(name,args)=>{calls.push({name,args});return {data:rpcData,error:rpcError};},from(table){calls.push({table});const q={select(){return q;},eq(){return q;},is(){memberCalls++;return Promise.resolve({data:memberCalls===1?members:current,error:null});},in(){return q;},order(){return Promise.resolve({data:[{id:trip,title:'Private trip',destination:'Tokyo',time_zone:'Asia/Tokyo'}],error:tripError});}};return q;}};return c;
}
test('disabled foundation makes no new schema or auth calls',async()=>{
 const client={auth:{getUser(){throw Error('must not run');}}};
 assert.deepEqual(await loadTripDashboard(client,false),{status:'disabled'});
 await assert.rejects(createGeneralTrip(client,false,id,draft),/not available/);
});
test('dashboard requires confirmed nonanonymous identity before protected queries',async()=>{
 for(const u of [null,{...user,email_confirmed_at:null},{...user,is_anonymous:true}]){const c=mock({users:[u]});assert.notEqual((await loadTripDashboard(c,true)).status,'ready');assert.equal(c.calls.length,0);}
});
test('dashboard shows only own currently active trip roles and fails closed on missing migration',async()=>{
 const c=mock();const r=await loadTripDashboard(c,true);assert.equal(r.status,'ready');assert.equal(r.trips[0].role,'organizer');
 assert.equal((await loadTripDashboard(mock({tripError:{code:'42703'}}),true)).status,'unavailable');
 assert.deepEqual((await loadTripDashboard(mock({current:[]}),true)).trips,[]);
 assert.deepEqual((await loadTripDashboard(mock({members:[]}),true)).trips,[]);
 assert.equal((await loadTripDashboard(mock({users:[user,{...user,id:trip}]}),true)).status,'unavailable');
});
test('creation validates bounds and identity, sends no client owner/role, preserves retry request',async()=>{
 for(const patch of [{participantLimit:0},{participantLimit:101},{participantLimit:1.5},{end:'2030-03-01'},{start:'2030-02-30'},{destination:' '},{timeZone:'Wrong/Zone'}])assert.equal(validateTripDraft({...draft,...patch}),false);
 const c=mock();assert.equal(await createGeneralTrip(c,true,id,draft),trip);assert.equal(await createGeneralTrip(c,true,id,draft),trip);
 assert.deepEqual(c.calls[0],{name:'vybr_create_trip',args:{p_request:id,p_title:draft.title,p_destination:draft.destination,p_start:draft.start,p_end:draft.end,p_zone:draft.timeZone,p_limit:8,p_name:'Organizer',p_expected_user:id}});
 assert.deepEqual(c.calls[0],c.calls[1]);
 await assert.rejects(createGeneralTrip(mock({users:[{...user,email_confirmed_at:null}]}),true,id,draft),/confirmed/);
 await assert.rejects(createGeneralTrip(mock({rpcError:{message:'private SQL detail'}}),true,id,draft),e=>!e.message.includes('SQL')&&/same details/.test(e.message));
 await assert.rejects(createGeneralTrip(mock({rpcData:'https://evil.example'}),true,id,draft),/could not be confirmed/);
 await assert.rejects(createGeneralTrip(mock({users:[user,{...user,id:trip}]}),true,id,draft),/account changed/);
});
test('destination-neutral editing uses explicit UTC across DST and keeps Palau compatibility',()=>{
 for(const zone of ['America/New_York','Europe/London','Asia/Tokyo']){
  assert.equal(tripDateTimeInput('2030-03-10T07:30:00Z',zone),'2030-03-10T07:30');
  assert.equal(tripDateTimeToIso('2030-03-10T07:30',zone),'2030-03-10T07:30:00.000Z');
  assert.throws(()=>tripDateTimeToIso('2030-02-30T07:30',zone));
 }
 assert.equal(tripDateTimeInput('2030-03-10T07:30:00Z','Pacific/Palau'),'2030-03-10T16:30');
 assert.equal(tripDateTimeToIso('2030-03-10T16:30','Pacific/Palau'),'2030-03-10T07:30:00.000Z');
});

test('only definitive validation errors permit editing; uncertain errors retain same request',async()=>{
 await assert.rejects(createGeneralTrip(mock({rpcError:{code:'22023'}}),true,id,draft),TripRejectedError);
 for(const code of ['P0001','','42501']) await assert.rejects(createGeneralTrip(mock({rpcError:{code}}),true,id,draft),e=>!(e instanceof TripRejectedError));
});
test('submitted retry state survives unavailable rendering but cannot be used by another account',()=>{
 const attempt={userId:id,requestId:trip,draft};
 assert.equal(attemptForUser(attempt,id),attempt);
 assert.equal(attemptForUser(attempt,trip),null);
 assert.equal(attemptForUser(null,id),null);
});
