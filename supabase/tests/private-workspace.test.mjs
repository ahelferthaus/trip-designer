import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addPrivateJournalEntry, loadPrivateTripWorkspace, saveOwnGroupArrival, saveOwnPrivateTravelDetails, setPrivateRsvp } from '../../src/lib/privateTripWorkspace.ts';

const tripId='10000000-0000-4000-8000-000000000001';
const user={id:'20000000-0000-4000-8000-000000000001',is_anonymous:false,email_confirmed_at:'2030-02-01T00:00:00Z'};
const trip={id:tripId,title:'Sample Palau Group',start_date:'2030-03-07',end_date:'2030-03-19',time_zone:'Pacific/Palau',coordination:{timeline:[]}};

function fakeClient({identity=user,queryErrorTable=null}={}) {
  const calls=[];
  const data={
    palau_members:[{trip_id:tripId,user_id:user.id,display_name:'Organizer',role:'organizer'}],
    palau_arrivals:[{trip_id:tripId,user_id:user.id,arrival_window:'7 Mar evening',departure_window:'19 Mar morning',handoff_note:'Meet in lobby',transfer_status:'coordinating'}],
    palau_travel_details:[{trip_id:tripId,user_id:user.id,arrival_at:'2030-03-07T15:00:00+09:00',departure_at:null,flight_reference:'Sample',lodging_reference:'Sample',private_note:'Private',updated_at:'2030-02-01T00:00:00Z'}],
    palau_checklist:[], palau_activities:[], palau_rsvps:[], palau_journal:[],
  };
  const client={
    calls,
    auth:{getUser:async()=>({data:{user:identity},error:null})},
    from(table){
      const call={table,operation:'select',payload:null}; calls.push(call);
      const result=()=>({data:data[table] ?? [],error:queryErrorTable===table?{message:'denied'}:null});
      const query={
        select(){return query;}, eq(){return query;}, is(){return query;}, order(){return query;},
        maybeSingle:async()=>table==='palau_members'?{data:{role:'organizer',revoked_at:null},error:null}:{data:trip,error:null},
        update(payload){call.operation='update';call.payload=payload;return query;},
        upsert(payload,options){call.operation='upsert';call.payload=payload;call.options=options;return query;},
        insert(payload){call.operation='insert';call.payload=payload;return query;},
        delete(){call.operation='delete';return query;},
        then(resolve,reject){return Promise.resolve(result()).then(resolve,reject);},
      };
      return query;
    },
    rpc:async(name,params)=>{calls.push({operation:'rpc',name,params});return {data:null,error:null};},
    storage:{from(bucket){return {
      upload:async(path,file,options)=>{calls.push({operation:'upload',bucket,path,type:file.type,options});return {data:{path},error:null};},
      remove:async(paths)=>{calls.push({operation:'remove',bucket,paths});return {data:[],error:null};},
    };}},
  };
  return client;
}

test('private workspace loads only after verified membership and keeps travel details separate',async()=>{
  const client=fakeClient();
  const workspace=await loadPrivateTripWorkspace(client,tripId);
  assert.equal(workspace.trip.title,'Sample Palau Group');
  assert.equal(workspace.currentUserId,user.id);
  assert.equal(workspace.role,'organizer');
  assert.equal(workspace.groupArrivals[0].handoff_note,'Meet in lobby');
  assert.equal(workspace.privateTravelDetails[0].private_note,'Private');
  assert.ok(client.calls.some(call=>call.table==='palau_travel_details'));
});

test('private workspace fails closed when any protected query fails',async()=>{
  await assert.rejects(loadPrivateTripWorkspace(fakeClient({queryErrorTable:'palau_travel_details'}),tripId),/unavailable/i);
});

test('travel and group logistics writes derive the authenticated user id',async()=>{
  const client=fakeClient();
  await saveOwnGroupArrival(client,tripId,{arrival_window:'7 Mar',departure_window:'19 Mar',handoff_note:'Lobby',transfer_status:'confirmed'});
  await saveOwnPrivateTravelDetails(client,tripId,{arrival_at:null,departure_at:null,flight_reference:'Sample airline reference',lodging_reference:'Sample lodging reference',private_note:'Private'});
  const group=client.calls.find(call=>call.table==='palau_arrivals'&&call.operation==='insert');
  const privateRow=client.calls.find(call=>call.table==='palau_travel_details'&&call.operation==='insert');
  assert.equal(group.payload.user_id,user.id);
  assert.equal(privateRow.payload.user_id,user.id);
  assert.equal(privateRow.payload.trip_id,tripId);
});

test('RSVP uses the identity-derived RPC with no user override',async()=>{
  const client=fakeClient();
  await setPrivateRsvp(client,'51000000-0000-4000-8000-000000000001','maybe');
  assert.deepEqual(client.calls.find(call=>call.operation==='rpc'),{operation:'rpc',name:'palau_set_rsvp',params:{p_activity:'51000000-0000-4000-8000-000000000001',p_response:'maybe'}});
});

test('journal media uses the private bucket and authenticated trip/user path',async()=>{
  const client=fakeClient();
  const file=new File([new Uint8Array([1,2,3])],'sample.png',{type:'image/png'});
  await addPrivateJournalEntry(client,tripId,'Sample private memory',file);
  const upload=client.calls.find(call=>call.operation==='upload');
  const insert=client.calls.find(call=>call.table==='palau_journal'&&call.operation==='insert');
  assert.equal(upload.bucket,'palau-private');
  assert.match(upload.path,new RegExp(`^${tripId}/${user.id}/[a-f0-9-]+\\.png$`));
  assert.equal(insert.payload.user_id,user.id);
  assert.equal(insert.payload.media_path,upload.path);
});


test('workspace attendance excludes revoked members just like the capacity RPC',async()=>{
  const client=fakeClient();
  const from=client.from;
  client.from=table=>{
    if(table!=='palau_rsvps') return from(table);
    const query={select:()=>query,eq:()=>query,order:()=>query,then:resolve=>Promise.resolve({data:[{user_id:user.id,response:'going'},{user_id:'revoked-user',response:'going'}],error:null}).then(resolve)};
    return query;
  };
  const workspace=await loadPrivateTripWorkspace(client,tripId);
  assert.deepEqual(workspace.rsvps.map(r=>r.user_id),[user.id]);
});


test('workspace discards fetched data when the session changes during loading', async () => {
  for (const laterIdentity of [null, { ...user, id: 'another-user' }]) {
    const client = fakeClient(); let calls = 0;
    client.auth.getUser = async () => ({ data: { user: ++calls === 1 ? user : laterIdentity }, error: null });
    await assert.rejects(loadPrivateTripWorkspace(client, tripId), /unavailable/);
    assert.equal(calls, 2);
  }
});

test('workspace discards fetched data when membership is revoked during loading', async () => {
  const client = fakeClient(); const from = client.from; let membershipChecks = 0;
  client.from = table => {
    const query = from(table);
    if (table === 'palau_members') query.maybeSingle = async () => ({ data: ++membershipChecks === 1 ? { role: 'organizer', revoked_at: null } : null, error: null });
    return query;
  };
  await assert.rejects(loadPrivateTripWorkspace(client, tripId), /unavailable/);
  assert.equal(membershipChecks, 2);
});
