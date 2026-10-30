import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { palauDateTimeInput, palauDateTimeToIso, safeExternalUrl } from '../src/lib/privateTripPresentation.ts';

test('Palau travel-time editing round-trips an instant independently of browser timezone', () => {
  for (const zone of ['UTC', 'America/Los_Angeles', 'Pacific/Palau']) {
    const previous = process.env.TZ;
    process.env.TZ = zone;
    try {
      assert.equal(palauDateTimeInput('2030-03-07T06:30:00Z'), '2030-03-07T15:30');
      assert.equal(palauDateTimeToIso('2030-03-07T15:30'), '2030-03-07T06:30:00.000Z');
      assert.equal(palauDateTimeToIso('2030-03-01T00:15'), '2030-02-28T15:15:00.000Z');
    } finally { if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous; }
  }
  assert.equal(palauDateTimeInput(null), '');
  assert.equal(palauDateTimeToIso(''), null);
  assert.throws(() => palauDateTimeToIso('2030-02-30T12:00'));
  assert.throws(() => palauDateTimeToIso('invalid'));
});

test('trip links allow only web URLs without embedded credentials', () => {
  assert.equal(safeExternalUrl('https://example.test/activity'), 'https://example.test/activity');
  for (const value of ['javascript:alert(1)', 'data:text/html,test', 'file:///tmp/test', '//example.test', 'https://user:password@example.test', undefined]) assert.equal(safeExternalUrl(value), undefined);
});

test('pilot permissions policy does not disable legacy route geolocation', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  for (const rule of config.headers) {
    if (rule.headers.some(header => header.key === 'Permissions-Policy')) assert.equal(rule.source, '/pilot/(.*)');
  }
});
