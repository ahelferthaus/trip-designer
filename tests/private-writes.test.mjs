import test from 'node:test';
import assert from 'node:assert/strict';
import { saveOwnGroupArrival, saveOwnPrivateTravelDetails, deletePrivateJournalEntry } from '../src/lib/privateTripWorkspace.ts';

const user = { id: '20000000-0000-4000-8000-000000000001', email_confirmed_at: '2030-01-01T00:00:00Z', is_anonymous: false };
const tripId = '10000000-0000-4000-8000-000000000001';
function client({ existing = false, insertError = null, mediaError = null, removedObjects = undefined } = {}) {
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
        select() { return query; },
        then(resolve, reject) { return Promise.resolve({ data: [{ user_id: user.id }], error: call.operation === 'insert' ? insertError ?? (existing ? { code: '23505' } : null) : null }).then(resolve, reject); },
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
  const denied = client({ mediaError: { message: 'denied' } });
  await assert.rejects(deletePrivateJournalEntry(denied, tripId, 'entry', 'sample.png'), /entry was kept/);
  assert.deepEqual(denied.calls.map(call => call.operation), ['remove']);
});

test('empty, missing or mismatched storage results never delete the journal row', async () => {
  for (const removedObjects of [[], null, [{ name: 'a-different-object.png' }]]) {
    const c = client({ removedObjects });
    await assert.rejects(deletePrivateJournalEntry(c, tripId, 'entry', 'expected.png'), /entry was kept/);
    assert.deepEqual(c.calls.map(call => call.operation), ['remove']);
  }
});
