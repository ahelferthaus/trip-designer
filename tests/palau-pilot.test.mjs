import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  PILOT_TRAVELERS, PILOT_ACCESS_PREVIEWS, INITIAL_TASKS, INITIAL_ACTIVITIES, COORDINATION,
  PILOT_TIME_ZONE, PILOT_SAMPLE_YEAR, PILOT_EXPECTED_GROUP_SIZE, canViewPilot, canEditTask, visibleTasks, toggleTask,
  goingCount, updateRsvp, updateActivityStatus, buildEssentials,
} from '../src/lib/palauPilot.ts';

const [a, b, c, organizer] = PILOT_TRAVELERS;
const shared = INITIAL_TASKS.find(item => item.id === 's2');
const personal = INITIAL_TASKS.find(item => item.id === 'a2');

test('sample group is exactly eight people: one organizer plus seven travelers, first four order preserved', () => {
  assert.equal(PILOT_EXPECTED_GROUP_SIZE, 8);
  assert.equal(PILOT_TRAVELERS.length, PILOT_EXPECTED_GROUP_SIZE);
  assert.deepEqual(PILOT_TRAVELERS.slice(0, 4).map(person => person.id), ['traveler-a', 'traveler-b', 'traveler-c', 'organizer']);
  assert.equal(PILOT_TRAVELERS.filter(person => person.role === 'organizer').length, 1);
  assert.equal(PILOT_TRAVELERS.filter(person => person.role === 'member').length, 7);
  assert.equal(new Set(PILOT_TRAVELERS.map(person => person.id)).size, PILOT_EXPECTED_GROUP_SIZE);
  assert.equal(new Set(PILOT_TRAVELERS.map(person => person.initials)).size, PILOT_EXPECTED_GROUP_SIZE, 'avatar initials are distinct');
  for (const preview of PILOT_ACCESS_PREVIEWS) assert.equal(PILOT_TRAVELERS.some(person => person.id === preview.id), false);
});

test('visible group count comes from the constant, not a hardcoded four', () => {
  const page = readFileSync(new URL('../src/pages/PalauPilotPage.tsx', import.meta.url), 'utf8');
  assert.match(page, /\{PILOT_EXPECTED_GROUP_SIZE\} SAMPLE TRAVELERS/);
  assert.doesNotMatch(page, /\b\d+ SAMPLE TRAVELERS/);
});

test('every one of the eight views sees shared items plus only their own personal checklist', () => {
  for (const actor of PILOT_TRAVELERS) {
    assert.equal(canViewPilot(actor), true);
    const own = INITIAL_TASKS.filter(task => task.scope === 'personal' && task.ownerId === actor.id);
    assert.ok(own.length >= 1, `${actor.name} has a meaningful personal checklist example`);
    const visible = visibleTasks(actor, INITIAL_TASKS);
    assert.deepEqual(visible.filter(task => task.scope === 'personal').map(task => task.id), own.map(task => task.id));
    assert.equal(visible.filter(task => task.scope === 'shared').length, INITIAL_TASKS.filter(task => task.scope === 'shared').length);
    for (const task of own) {
      assert.equal(canEditTask(actor, task), true);
      for (const other of PILOT_TRAVELERS.filter(person => person.id !== actor.id)) {
        assert.equal(canEditTask(other, task), false, `${other.name} cannot edit ${actor.name}'s personal item`);
        assert.deepEqual(toggleTask(other, INITIAL_TASKS, task.id), INITIAL_TASKS);
      }
      assert.equal(toggleTask(actor, INITIAL_TASKS, task.id).find(item => item.id === task.id).done, !task.done);
    }
  }
});

test('each of the eight members can only change their own RSVP', () => {
  let activities = INITIAL_ACTIVITIES;
  for (const actor of PILOT_TRAVELERS) {
    const before = activities.find(item => item.id === 'rock-islands').responses;
    const result = updateRsvp(actor, activities, 'rock-islands', 'maybe');
    assert.equal(result.error, null);
    activities = result.activities;
    const after = activities.find(item => item.id === 'rock-islands').responses;
    assert.equal(after[actor.id], 'maybe');
    for (const [id, response] of Object.entries(before)) if (id !== actor.id) assert.equal(after[id], response);
  }
  assert.equal(Object.keys(activities.find(item => item.id === 'rock-islands').responses).length, PILOT_EXPECTED_GROUP_SIZE);
});

test('a four-seat activity stays four seats inside an eight-person group', () => {
  const [, , , , d, e, f] = PILOT_TRAVELERS;
  const table = INITIAL_ACTIVITIES.find(item => item.id === 'sunset');
  assert.equal(table.capacity, 4, 'capacity is activity-specific and was not expanded to the group size');
  for (const activity of INITIAL_ACTIVITIES) assert.ok(activity.capacity < PILOT_EXPECTED_GROUP_SIZE, `${activity.title} capacity is smaller than the group`);
  assert.equal(goingCount(table), 3);
  const fourth = updateRsvp(d, INITIAL_ACTIVITIES, table.id, 'going');
  assert.equal(fourth.error, null);
  assert.equal(goingCount(fourth.activities.find(item => item.id === table.id)), 4);
  assert.ok(updateRsvp(e, fourth.activities, table.id, 'going').error, 'fifth Going is refused');
  assert.ok(updateRsvp(f, fourth.activities, table.id, 'going').error);
  assert.equal(updateRsvp(e, fourth.activities, table.id, 'maybe').error, null, 'Maybe is not blocked by capacity');
  assert.equal(updateRsvp(d, fourth.activities, table.id, 'going').error, null, 'repeat Going by a seated traveler is accepted');
  const freed = updateRsvp(d, fourth.activities, table.id, 'not-going');
  assert.equal(goingCount(freed.activities.find(item => item.id === table.id)), 3);
  const refilled = updateRsvp(e, freed.activities, table.id, 'going');
  assert.equal(refilled.error, null);
  assert.equal(goingCount(refilled.activities.find(item => item.id === table.id)), 4);
  assert.equal(goingCount(INITIAL_ACTIVITIES.find(item => item.id === table.id)), 3, 'fixture is untouched');
});

test('only member and organizer previews see the sample trip', () => {
  for (const actor of PILOT_TRAVELERS) assert.equal(canViewPilot(actor), true);
  for (const actor of PILOT_ACCESS_PREVIEWS) {
    assert.equal(canViewPilot(actor), false);
    assert.deepEqual(visibleTasks(actor, INITIAL_TASKS), []);
    assert.deepEqual(toggleTask(actor, INITIAL_TASKS, shared.id), INITIAL_TASKS);
    assert.ok(updateRsvp(actor, INITIAL_ACTIVITIES, 'rock-islands', 'maybe').error);
  }
});

test('personal checklists stay personal, including from the organizer', () => {
  assert.equal(canEditTask(a, personal), true);
  for (const actor of [b, c, organizer]) {
    assert.equal(canEditTask(actor, personal), false);
    assert.equal(visibleTasks(actor, INITIAL_TASKS).some(item => item.id === personal.id), false);
    assert.deepEqual(toggleTask(actor, INITIAL_TASKS, personal.id), INITIAL_TASKS);
  }
  const changed = toggleTask(a, INITIAL_TASKS, personal.id);
  assert.equal(changed.find(item => item.id === personal.id).done, true);
  assert.equal(personal.done, false, 'original sample fixture remains unchanged');
});

test('shared checklist is visible to members but editable only by owner or organizer', () => {
  assert.equal(canEditTask(a, shared), false);
  assert.equal(canEditTask(b, shared), true);
  assert.equal(canEditTask(organizer, shared), true);
  for (const actor of PILOT_TRAVELERS) assert.ok(visibleTasks(actor, INITIAL_TASKS).some(item => item.id === shared.id));
  assert.deepEqual(toggleTask(a, INITIAL_TASKS, shared.id), INITIAL_TASKS);
  assert.equal(toggleTask(organizer, INITIAL_TASKS, shared.id).find(item => item.id === shared.id).done, true);
});

test('RSVP updates only the acting traveler, never another person', () => {
  const result = updateRsvp(a, INITIAL_ACTIVITIES, 'rock-islands', 'going');
  assert.equal(result.error, null);
  const changed = result.activities.find(item => item.id === 'rock-islands');
  assert.equal(goingCount(changed), 3);
  assert.equal(changed.responses[a.id], 'going');
  assert.equal(changed.responses[b.id], 'going');
  assert.equal(changed.responses[c.id], 'going');
  assert.equal(INITIAL_ACTIVITIES[0].responses[a.id], 'maybe');
});

test('capacity blocks another Going, permits Maybe, Not going, repeat Going and leaving', () => {
  const full = INITIAL_ACTIVITIES.find(item => item.id === 'snorkel');
  assert.equal(goingCount(full), 2);
  assert.ok(updateRsvp(a, INITIAL_ACTIVITIES, full.id, 'going').error);
  assert.equal(updateRsvp(a, INITIAL_ACTIVITIES, full.id, 'maybe').error, null);
  assert.equal(updateRsvp(a, INITIAL_ACTIVITIES, full.id, 'not-going').error, null);
  assert.equal(updateRsvp(b, INITIAL_ACTIVITIES, full.id, 'going').error, null);
  const left = updateRsvp(b, INITIAL_ACTIVITIES, full.id, 'not-going');
  const joined = updateRsvp(a, left.activities, full.id, 'going');
  assert.equal(joined.error, null);
  assert.equal(goingCount(joined.activities.find(item => item.id === full.id)), 2);
});

test('activity plan status is organizer-only and independent from attendance', () => {
  assert.deepEqual(updateActivityStatus(a, INITIAL_ACTIVITIES, 'rock-islands'), INITIAL_ACTIVITIES);
  const changed = updateActivityStatus(organizer, INITIAL_ACTIVITIES, 'rock-islands');
  assert.equal(changed[0].status, 'confirmed');
  assert.deepEqual(changed[0].responses, INITIAL_ACTIVITIES[0].responses);
  assert.equal(updateRsvp(a, INITIAL_ACTIVITIES, 'rock-islands', 'going').activities[0].status, 'proposed');
});

test('unknown IDs do not mutate data', () => {
  assert.deepEqual(toggleTask(a, INITIAL_TASKS, 'missing'), INITIAL_TASKS);
  assert.ok(updateRsvp(a, INITIAL_ACTIVITIES, 'missing', 'maybe').error);
  assert.deepEqual(updateActivityStatus(organizer, INITIAL_ACTIVITIES, 'missing'), INITIAL_ACTIVITIES);
});

test('download is static, clearly sample, timezone-explicit, and excludes identity data', () => {
  const text = buildEssentials();
  assert.match(text, /SAMPLE ESSENTIALS/);
  assert.match(text, /not a booking/);
  assert.match(text, /UTC\+9 \/ Pacific\/Palau/);
  assert.match(text, /March 2030 \(fictional\)/);
  assert.match(text, /7–11 MAR/);
  assert.match(text, /11–18 MAR/);
  assert.match(text, /19 MAR/);
  for (const actor of PILOT_TRAVELERS) assert.equal(text.includes(actor.name), false);
  assert.equal(text.includes('@'), false);
  assert.equal(PILOT_TIME_ZONE, 'Pacific/Palau');
});

test('sample fixtures use the fictional March 2030 window and carry no real logistics', () => {
  assert.equal(PILOT_SAMPLE_YEAR, 2030);
  const model = readFileSync(new URL('../src/lib/palauPilot.ts', import.meta.url), 'utf8');
  const page = readFileSync(new URL('../src/pages/PalauPilotPage.tsx', import.meta.url), 'utf8');
  for (const source of [model, page]) {
    assert.doesNotMatch(source, /\b20(2[0-9])\b/, 'no near-term calendar years in sample source');
    assert.doesNotMatch(source, /\b(Nov|November|Dec|December|Oct|October)\b/, 'sample window is March, not a real travel month');
    assert.doesNotMatch(source, /\b[A-Z]{2}\s?\d{2,4}\b/, 'no airline-style flight numbers');
    assert.doesNotMatch(source, /@|\+\d{2,3}\s?\d{3}/, 'no email addresses or phone numbers');
  }
  for (const item of COORDINATION) assert.doesNotMatch(item.time, /\d{1,2}:\d{2}/, 'arrival handoffs use windows, not exact clock times');
  for (const item of [...INITIAL_TASKS, ...INITIAL_ACTIVITIES, ...COORDINATION]) {
    assert.doesNotMatch(JSON.stringify(item), /\bNov\b|2026/);
  }
});

test('pilot route is lazy and outside legacy auth/store providers', () => {
  const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  assert.match(app, /lazy\(\(\) => import\("\.\/LegacyApp"\)\)/);
  assert.match(app, /path="\/pilot\/palau"/);
  assert.doesNotMatch(app, /<AuthProvider|<TripStoreProvider|SpaceBackgroundSetter/);
  const model = readFileSync(new URL('../src/lib/palauPilot.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(model, /localStorage|sessionStorage|fetch\(|supabase\./);
});

test('Palau is a valid IANA timezone and dates cross UTC midnight correctly', () => {
  const date = new Date('2030-03-06T16:00:00Z');
  const local = new Intl.DateTimeFormat('en-GB', { timeZone: PILOT_TIME_ZONE, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
  assert.equal(local, '07/03/2030, 01:00');
});
