import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPrivateJourney } from '../src/lib/privateJourney.ts';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const fixture = () => ({
  trip: { id: 'trip-a', time_zone: 'Pacific/Palau' },
  members: [{ trip_id: 'trip-a', user_id: 'user-a', display_name: 'Traveler' }],
  activities: [{ id: 'activity-a', trip_id: 'trip-a', title: 'Harbor walk', starts_at: '2030-04-01T15:00:00Z', location: 'Harbor', metadata: { private: 'do not project' } }],
  journal: [{ id: 'memory-a', trip_id: 'trip-a', user_id: 'user-a', body: 'A shared memory', recorded_at: '2030-04-01T14:30:00Z', media_path: 'trip-a/user-a/photo.png' }],
  privateTravelDetails: [{ private_note: 'SECRET TRAVEL NOTE' }],
  checklist: [{ visibility: 'personal', title: 'SECRET PERSONAL TASK' }],
});
test('journey uses trip-local days, chronological order and explicit shared-field projection', () => {
  const result = buildPrivateJourney(fixture());
  assert.deepEqual(result.map(d => d.day), ['2030-04-01', '2030-04-02']);
  assert.equal(result[0].items[0].author, 'Traveler');
  assert.equal(result[0].items[0].mediaPath, 'trip-a/user-a/photo.png');
  assert.doesNotMatch(JSON.stringify(result), /SECRET|metadata|user_id/);
});
test('journey rejects cross-trip entries and malformed dates, including author lookup from another trip', () => {
  const input = fixture();
  input.members = [{ trip_id: 'other', user_id: 'user-a', display_name: 'Wrong trip author' }];
  input.activities.push({ ...input.activities[0], id: 'foreign', trip_id: 'other' });
  input.journal.push({ ...input.journal[0], id: 'foreign', trip_id: 'other' }, { ...input.journal[0], id: 'invalid', recorded_at: 'not-a-date' });
  const result = buildPrivateJourney(input).flatMap(d => d.items);
  assert.equal(result.length, 2);
  assert.equal(result[0].author, 'Trip member');
  assert.doesNotMatch(JSON.stringify(result), /foreign|invalid|Wrong trip/);
});
test('journey never exposes external, cross-owner or traversal media paths', () => {
  for (const path of ['https://example.com/photo.png', 'other/user-a/photo.png', 'trip-a/other/photo.png', 'trip-a/user-a/../photo.png', 'trip-a/user-a/photo.png?token=x', 'trip-a/user-a/photo%2epng']) {
    const input = fixture(); input.journal[0].media_path = path;
    assert.equal(buildPrivateJourney(input)[0].items[0].mediaPath, undefined);
  }
});
test('journey ordering is deterministic across equal timestamps, duplicates and DST boundaries', () => {
  const input = fixture(); input.trip.time_zone = 'America/New_York';
  input.activities[0].starts_at = '2030-11-03T06:30:00Z';
  input.journal[0].recorded_at = '2030-11-03T05:30:00Z';
  input.journal.push({ ...input.journal[0] });
  const result = buildPrivateJourney(input);
  assert.equal(result.length, 1); assert.equal(result[0].items.length, 2);
  assert.equal(result[0].items[0].kind, 'memory');
  input.activities[0].starts_at = input.journal[0].recorded_at;
  assert.equal(buildPrivateJourney(input)[0].items[0].kind, 'activity');
});
test('journey returns a useful empty state and rejects invalid trip zones', () => {
  const input = fixture(); input.activities = []; input.journal = [];
  assert.deepEqual(buildPrivateJourney(input), []);
  input.trip.time_zone = 'Invalid/Zone'; assert.throws(() => buildPrivateJourney(input), RangeError);
  for (const zone of ['', undefined, null]) { input.trip.time_zone = zone; assert.throws(() => buildPrivateJourney(input), RangeError); }
});
test('journey rejects calendar overflow, missing offsets and date-only timestamps', () => {
  for (const at of ['2030-02-31T10:00:00Z','2030-04-01','2030-04-01T10:00:00','infinity']) {
    const input=fixture(); input.activities=[]; input.journal[0].recorded_at=at;
    assert.deepEqual(buildPrivateJourney(input), []);
  }
  const input=fixture(); input.activities=[]; input.journal[0].recorded_at='2030-04-01T10:00:00.123456+00:00';
  assert.equal(buildPrivateJourney(input).length,1);
});

const source = await readFile(new URL('../src/pages/PrivateJourney.tsx', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext } }).outputText
  .replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')))
  .replace("'react'", JSON.stringify(import.meta.resolve('react')))
  .replace("'../lib/privateJourney'", JSON.stringify(new URL('../src/lib/privateJourney.ts', import.meta.url).href))
  .replace("import { getPrivateJournalMediaUrl } from '../lib/privateTripWorkspace';", "const getPrivateJournalMediaUrl = () => { throw new Error('Unexpected render-time media request'); };");
const { default: PrivateJourney } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const render = workspace => renderToStaticMarkup(createElement(PrivateJourney, { client: {}, workspace }));
test('render labels plans honestly and escapes shared content without exposing private fields', () => {
  const input = fixture(); input.journal[0].body = '<script>unsafe()</script>';
  const html = render(input);
  assert.match(html, /Planned activity/); assert.match(html, /not a record of places visited/);
  assert.match(html, /&lt;script&gt;/); assert.match(html, /Loading private photo/);
  assert.doesNotMatch(html, /SECRET|<script>|<img|trip-a\/user-a/);
});
test('render presents empty and invalid-zone states without falling back to another date', () => {
  const input = fixture(); input.activities = []; input.journal = [];
  assert.match(render(input), /No activities or memories yet/);
  input.trip.time_zone = 'Invalid/Zone';
  assert.match(render(input), /role="alert"/); assert.doesNotMatch(render(input), /<time/);
});
