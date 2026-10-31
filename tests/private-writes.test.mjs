import test from 'node:test';
import assert from 'node:assert/strict';
import { saveOwnGroupArrival, saveOwnPrivateTravelDetails, addPrivateJournalEntry, deletePrivateJournalEntry, setPrivateChecklistDone, updatePrivateActivityStatus } from '../src/lib/privateTripWorkspace.ts';

const user = { id: '20000000-0000-4000-8000-000000000001', email_confirmed_at: '2030-01-01T00:00:00Z', is_anonymous: false };
const tripId = '10000000-0000-4000-8000-000000000001';
function client({ existing = false, insertError = null, mediaError = null, removedObjects = undefined, affectedRows = [{ user_id: user.id }] } = {}) {
  const calls = [];
  return {
    calls,
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    from(table) {
      const call = { table, filters: [] }; calls.push(call);
      const query = {
        insert(payload) { call.operation = 'insert'; call.payload = payload; return query; },
        update(payload) { call.operation = 'update'; call.payload = payload; return query; },
        delete() { call.operation = 'delete'; return query; },
        eq(key, value) { call.filters.push([key, value]); return query; },
        is(key, value) { call.filters.push([key, value]); return query; },
        select() { return query; },
        then(resolve, reject) { return Promise.resolve({ data: affectedRows, error: call.operation === 'insert' ? insertError ?? (existing ? { code: '23505' } : null) : null }).then(resolve, reject); },
      };
      return query;
    },
    storage: { from: () => ({ remove: async paths => { calls.push({ operation: 'remove', paths }); return { data: removedObjects === undefined ? paths.map(name => ({ name })) : removedObjects, error: mediaError }; } }) },
  };
}

test('existing logistics update only mutable fields and pin both identity filters', async () => {
  const c = client({ existing: true });
  await saveOwnGroupArrival(c, tripId, { arrival_window: 'Afternoon', departure_window: '', handoff_note: '', transfer_status: 'needed' });
  await saveOwnPrivateTravelDetails(c, tripId, { arrival_at: null, departure_at: null, flight_reference: '', lodging_reference: '', private_note: 'Example' });
  const updates = c.calls.filter(call => call.operation === 'update');
  assert.equal(updates.length, 2);
  for (const update of updates) {
    assert.equal('trip_id' in update.payload, false);
    assert.equal('user_id' in update.payload, false);
    assert.deepEqual(update.filters, [['trip_id', tripId], ['user_id', user.id]]);
  }
});

test('a failed insert other than a duplicate does not attempt an update', async () => {
  const c = client({ insertError: { code: '42501' } });
  await assert.rejects(saveOwnGroupArrival(c, tripId, { arrival_window: '', departure_window: '', handoff_note: '', transfer_status: 'needed' }), /unavailable/);
  assert.equal(c.calls.length, 1);
});

test('journal attachment cleanup precedes row deletion and failures preserve the row', async () => {
  const c = client();
  await deletePrivateJournalEntry(c, tripId, 'entry', `${tripId}/${user.id}/sample.png`);
  assert.deepEqual(c.calls.map(call => call.operation), ['remove', 'delete']);
  assert.deepEqual(c.calls.at(-1).filters.at(-1), ['media_path', `${tripId}/${user.id}/sample.png`]);
  const denied = client({ mediaError: { message: 'denied' } });
  await assert.rejects(deletePrivateJournalEntry(denied, tripId, 'entry', 'sample.png'), /entry was kept/);
  assert.deepEqual(denied.calls.map(call => call.operation), ['remove']);
});

test('empty, missing or mismatched storage results never delete the journal row', async () => {
  for (const removedObjects of [[], null, [{ name: 'a-different-object.png' }]]) {
    const c = client({ removedObjects });
    await assert.rejects(deletePrivateJournalEntry(c, tripId, 'entry', 'expected.png'), /entry was kept/);
    assert.deepEqual(c.calls.map(call => call.operation).filter(Boolean), ['remove']);
  }
});


test('RLS no-op writes never report success, while one affected row succeeds', async () => {
  const actions = [
    c => setPrivateChecklistDone(c, tripId, 'item', true),
    c => updatePrivateActivityStatus(c, tripId, 'activity', 'confirmed'),
    c => deletePrivateJournalEntry(c, tripId, 'entry', null),
  ];
  for (const action of actions) {
    for (const affectedRows of [[], null]) await assert.rejects(action(client({ affectedRows })), /unavailable/);
    await action(client({ affectedRows: [{ id: 'record' }] }));
  }
});

test('partial photo deletion requires authoritative absence proof and final affected row', async () => {
  const path = `${tripId}/${user.id}/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.png`;
  function retryClient(proof, rows = [{id:'entry'}]) {
    const c=client({removedObjects:[],affectedRows:rows});
    c.rpc=async(name,args)=>{assert.equal(name,'palau_journal_media_absent');assert.deepEqual(args,{p_trip:tripId,p_entry:'entry',p_path:path});return proof;};
    return c;
  }
  const c=retryClient({data:true,error:null});await deletePrivateJournalEntry(c,tripId,'entry',path);
  assert.equal(c.calls.filter(c=>c.operation==='delete').length,1);
  for(const proof of [{data:false,error:null},{data:null,error:null},{data:true,error:{message:'denied'}},{data:null,error:{code:'PGRST202'}}]){
    const c=retryClient(proof);await assert.rejects(deletePrivateJournalEntry(c,tripId,'entry',path),/entry was kept/);assert.equal(c.calls.filter(c=>c.operation==='delete').length,0);
  }
  await assert.rejects(deletePrivateJournalEntry(retryClient({data:true,error:null},[]),tripId,'entry',path),/unavailable/);
});

test('failed journal insert reports unconfirmed image cleanup without claiming rollback', async () => {
  const c=client({insertError:{code:'42501'},removedObjects:[]});
  const storage=c.storage.from();c.storage.from=()=>({...storage,upload:async()=>({error:null})});
  await assert.rejects(addPrivateJournalEntry(c,tripId,'Synthetic journal',new File(['fixture'],'fixture.png',{type:'image/png'})),/entry was not saved.*cleanup could not be confirmed/);
});

test('ambiguous journal insert failure never deletes a possibly committed attachment', async () => {
  const c=client({insertError:{message:'network outcome unknown'}});
  const storage=c.storage.from();c.storage.from=()=>({...storage,upload:async()=>({error:null})});
  await assert.rejects(addPrivateJournalEntry(c,tripId,'Synthetic journal',new File(['fixture'],'fixture.png',{type:'image/png'})),/save outcome could not be confirmed.*image was retained/);
  assert.equal(c.calls.some(call=>call.operation==='remove'),false);
});
