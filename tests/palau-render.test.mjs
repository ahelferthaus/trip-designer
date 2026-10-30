/** Static React render contract tests. These are NOT browser/layout/interaction QA. */
import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';

const vite = await createServer({ server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom' });
try {
  const { default: PalauPilotPage } = await vite.ssrLoadModule('/src/pages/PalauPilotPage.tsx');
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
