import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  PILOT_TRAVELERS, PILOT_ACCESS_PREVIEWS, INITIAL_TASKS, INITIAL_ACTIVITIES, COORDINATION,
  PILOT_TIME_ZONE, PILOT_SAMPLE_YEAR, canViewPilot, canEditTask, visibleTasks, toggleTask,
  goingCount, updateRsvp, updateActivityStatus, buildEssentials,
} from '../src/lib/palauPilot.ts';

const [a, b, c, organizer] = PILOT_TRAVELERS;
const shared = INITIAL_TASKS.find(item => item.id === 's2');
const personal = INITIAL_TASKS.find(item => item.id === 'a2');

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
