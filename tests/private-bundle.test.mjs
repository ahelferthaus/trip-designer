/** Production bundle hygiene. Scans dist/ for server-only seed markers, credential shapes and
 * synthetic privacy canaries planted in supabase/tests/fixtures. Real private-marker scanning is
 * performed outside this repository; this test only carries generic patterns and fictional canaries. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const { canaries } = JSON.parse(await readFile(new URL('../supabase/tests/fixtures/privacy-canaries.json', import.meta.url), 'utf8'));

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? files(join(directory, entry.name))
    : [join(directory, entry.name)]))).flat();
}

/** Paths and server-only artefacts that must never be referenced by client code. */
const forbiddenPaths = [
  'supabase/seed/', 'supabase/tests/fixtures/', 'private-import/', '.local.json',
  '_private.sql', 'palau_sample_private_seed', "set_config('app.palau_trip_id'",
];

/** Credential shapes. These are structural patterns, not real values. */
const credentialPatterns = [
  [/\bsb_secret_[A-Za-z0-9_-]{8,}/, 'Supabase secret key'],
  [/SUPABASE_SERVICE_ROLE(?:_KEY)?\s*[:=]\s*['"][^'"]{8,}/, 'service-role key assignment'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'PEM private key'],
  [/\beyJhbGciOi[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{40,}\.[A-Za-z0-9_-]{20,}/, 'embedded JWT'],
  [/\bsk-(?:ant-api\d{2}-|proj-)?[A-Za-z0-9_-]{32,}/, 'model-provider API key'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
  [/\bpostgres(?:ql)?:\/\/[^\s'"]+:[^\s'"]+@[^\s'"]+/, 'database connection string with password'],
];

test('production bundle excludes server-only seed paths, credential shapes and privacy canaries', async () => {
  const leaks = [];
  for (const file of await files(dist)) {
    const text = await readFile(file, 'utf8').catch(() => '');
    const name = relative(dist, file);
    for (const marker of forbiddenPaths) if (text.includes(marker)) leaks.push(`${name}: forbidden path "${marker}"`);
    for (const [pattern, label] of credentialPatterns) if (pattern.test(text)) leaks.push(`${name}: ${label}`);
    for (const canary of canaries) if (text.includes(canary)) leaks.push(`${name}: privacy canary "${canary}"`);
  }
  assert.deepEqual(leaks, [], `private or secret material found in build:\n${leaks.join('\n')}`);
});

test('privacy canaries are planted in the synthetic seed fixture so the scan is meaningful', async () => {
  assert.ok(canaries.length >= 3);
  const fixture = await readFile(new URL('../supabase/tests/fixtures/palau_sample_private_seed.sql', import.meta.url), 'utf8');
  for (const canary of canaries) assert.ok(fixture.includes(canary), `fixture should contain canary "${canary}"`);
});
