/** Static React render contract tests. These are NOT browser/layout/interaction QA. */
import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Do not invalidate the dependency cache of a running development/test session.
const cacheDir = await mkdtemp(join(tmpdir(), 'vybr-render-cache-'));
const vite = await createServer({ cacheDir, server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom' });
try {
  const { default: PalauPilotPage } = await vite.ssrLoadModule('/src/pages/PalauPilotPage.tsx');
  const { PILOT_TRAVELERS, PILOT_EXPECTED_GROUP_SIZE, INITIAL_TASKS } = await vite.ssrLoadModule('/src/lib/palauPilot.ts');
  await test('static React render: eight-person group count and every member view selector option', () => {
    const html = renderToString(React.createElement(MemoryRouter, { initialEntries: ['/pilot/palau?section=checklist'] }, React.createElement(PalauPilotPage)));
    // renderToString may place <!-- --> markers between adjacent text nodes.
    const text = html.replace(/<!-- -->/g, '');
    assert.ok(text.includes(`${PILOT_EXPECTED_GROUP_SIZE} SAMPLE TRAVELERS`));
    assert.equal(text.includes('4 SAMPLE TRAVELERS'), false);
    assert.equal(PILOT_TRAVELERS.length, PILOT_EXPECTED_GROUP_SIZE);
    for (const person of PILOT_TRAVELERS) assert.match(text, new RegExp(`<option value="${person.id}"[^>]*>${person.name}`), `selector lists ${person.name}`);
    assert.equal((text.match(/<option value="traveler-|<option value="organizer"/g) ?? []).length, PILOT_EXPECTED_GROUP_SIZE);
    assert.ok(text.includes('Viewing as Traveler A'));
    for (const task of INITIAL_TASKS.filter(item => item.scope === 'personal' && item.ownerId !== 'traveler-a')) {
      if (!INITIAL_TASKS.some(item => item.ownerId === 'traveler-a' && item.title === task.title)) assert.equal(html.includes(task.title), false, `default view hides ${task.ownerId}'s personal item`);
    }
  });
  for (const [section, heading] of [['home','Less coordinating.'], ['plan','What sounds like you?'], ['checklist','Ready, without the rush.'], ['journal','The things we’ll remember.'], ['essentials','Less signal. Still a plan.']]) {
    await test(`static React render: ${section} has its content and sample boundary`, () => {
      const html = renderToString(React.createElement(MemoryRouter, { initialEntries: [`/pilot/palau?section=${section}`] }, React.createElement(PalauPilotPage)));
      assert.ok(html.includes(heading), `expected heading ${heading}`);
      assert.ok(html.includes('SAMPLE PILOT'));
      assert.ok(html.includes('Skip to trip content'));
      assert.ok(html.includes('Palau local'));
      assert.equal(html.includes('type="password"'), false);
      assert.equal(html.includes('https://'), false, 'no remote assets in sample markup');
      if (section === 'journal') assert.ok(html.includes('8:20 AM'), 'sample card formats Pacific/Palau time');
      if (section === 'checklist') assert.ok(html.includes('aria-checked="false"'));
    });
  }
  await test('CSS provides phone breakpoints, reduced motion, focus states and a separate safe print surface', async () => {
    const css = await readFile(new URL('../src/pages/palau-pilot.css', import.meta.url), 'utf8');
    assert.match(css, /@media[^}]*max-width/);
    assert.match(css, /prefers-reduced-motion/);
    assert.match(css, /focus-visible/);
    assert.match(css, /@media print/);
    assert.match(css, /palau-print-only/);
    assert.doesNotMatch(css, /url\(\s*['"]?https?:/);
    const shell = await readFile(new URL('../index.html', import.meta.url), 'utf8');
    assert.doesNotMatch(shell, /fonts\.google/);
    assert.match(shell, /name="referrer" content="no-referrer"/);
  });
} finally { await vite.close(); }
