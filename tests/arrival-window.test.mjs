import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarArrivalWindow } from '../src/lib/arrivalWindow.ts';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
test('calendar shared window keeps explicit zone and optional time without converting to an instant', () => {
  assert.equal(calendarArrivalWindow('2030-11-06', '14:30', 'Pacific/Palau'), '2030-11-06 at 14:30 — Pacific/Palau');
  assert.equal(calendarArrivalWindow('2030-11-06', '', 'UTC'), '2030-11-06 (time not decided) — UTC');
  assert.match(calendarArrivalWindow('2030-11-03', '01:30', 'America/New_York'), /01:30 — America\/New_York/);
});
test('render preserves legacy text safely and exposes labelled native pickers', async () => {
  const source = await readFile('src/pages/ArrivalWindowField.tsx', 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext } }).outputText
    .replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')))
    .replace("'react'", JSON.stringify(import.meta.resolve('react')))
    .replace("'../lib/arrivalWindow'", JSON.stringify(new URL('../src/lib/arrivalWindow.ts', import.meta.url).href));
  const { default: Field } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
  let writes = 0;
  const html = renderToStaticMarkup(createElement(Field, { label: 'Arrival', value: 'Friday <script>late</script>', zone: 'Pacific/Palau', onChange: () => writes++ }));
  assert.equal(writes, 0);
  assert.match(html, /Friday &lt;script&gt;late&lt;\/script&gt;/);
  assert.match(html, /type="date"/);
  assert.match(html, /type="time"/);
  assert.equal((html.match(/form="[^"]+-calendar-draft"/g) ?? []).length, 2);
  assert.match(html, /Pacific\/Palau/);
  assert.match(html, /Leave blank if unknown/);
  assert.match(html, /<legend>Arrival<\/legend>/);
});
test('calendar rejects normalized invalid dates, malformed time and unknown zone', () => {
  for (const date of ['', '2030-02-30', '2030-13-01', '2030-1-01']) assert.throws(() => calendarArrivalWindow(date, '', 'UTC'));
  for (const time of ['24:00', '12:60', '8:30']) assert.throws(() => calendarArrivalWindow('2030-11-06', time, 'UTC'));
  assert.throws(() => calendarArrivalWindow('2030-11-06', '', 'not/a/zone'));
});
test('calendar editing preserves existing text, requires explicit apply, and never submits the parent form', async () => {
  const source = await readFile('src/pages/ArrivalWindowField.tsx', 'utf8');
  assert.match(source, /value=\{value\}/);
  assert.doesNotMatch(source, /useEffect|fetch\(|supabase|Date\.parse/);
  assert.match(source, /type="button"/);
  assert.match(source, /type="date"/);
  assert.match(source, /type="time"/);
  assert.match(source, /role="status"/);
});
