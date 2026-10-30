/** Local browser QA. Start Vite first. No real credentials or remote backend.
 * Point CHROMIUM_PATH at an existing Chromium/Chrome binary to avoid installing one:
 *   CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
 * Or install Playwright's bundled browser once: npx playwright install chromium; npm run test:browser
 * Artifacts default to <OS temp dir>/vybr-palau-qa; override with PILOT_QA_OUTPUT.
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { INITIAL_TASKS, PILOT_EXPECTED_GROUP_SIZE, PILOT_TRAVELERS } from '../src/lib/palauPilot.ts';

const base = process.env.PILOT_BASE_URL || 'http://127.0.0.1:5173';
const output = process.env.PILOT_QA_OUTPUT || join(tmpdir(), 'vybr-palau-qa');
await mkdir(output, { recursive: true });
const artifact = name => join(output, name);
const knownBrowserPaths = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'];
const executablePath = process.env.CHROMIUM_PATH || knownBrowserPaths.find(path => existsSync(path));
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, timezoneId: 'America/Los_Angeles', reducedMotion: 'reduce' });
await context.addInitScript(() => {
  window.__pilotGeolocationRequests = 0;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition = (_ok, fail) => { window.__pilotGeolocationRequests++; fail?.({ code: 1, message: 'Blocked in sample QA' }); };
    navigator.geolocation.watchPosition = (_ok, fail) => { window.__pilotGeolocationRequests++; fail?.({ code: 1, message: 'Blocked in sample QA' }); return 0; };
  }
});
const page = await context.newPage();
const pageErrors = [], externalRequests = [];
page.on('pageerror', error => pageErrors.push(error.message));
await context.route('**/*', route => {
  const url = new URL(route.request().url());
  if (!['data:', 'blob:'].includes(url.protocol) && url.origin !== new URL(base).origin) {
    externalRequests.push(url.origin + url.pathname); return route.abort();
  }
  return route.continue();
});
let passed = 0;
const check = async (name, fn) => { await fn(); passed++; console.log(`PASS ${name}`); };
const section = label => page.getByRole('navigation', { name: 'Sample trip sections' }).getByRole('button', { name: new RegExp(`^${label}`) });
const actor = value => page.getByLabel('Sample view').selectOption(value);
const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
try {
  await page.goto(`${base}/pilot/palau`, { waitUntil: 'networkidle' });
  await check('mobile home renders sample boundary, phases, arrivals and timezone without external requests', async () => {
    await page.getByRole('heading', { name: 'Palau, together.' }).waitFor();
    assert.match(await page.locator('body').innerText(), /Fictional travelers|Not connected/);
    assert.match(await page.locator('body').innerText(), /11–18 Mar · 7 boat nights/);
    assert.match(await page.locator('body').innerText(), /Palau local · UTC\+9/);
    assert.match(await page.locator('body').innerText(), new RegExp(`${PILOT_EXPECTED_GROUP_SIZE} SAMPLE TRAVELERS`));
    assert.equal(await page.locator('.palau-avatar-stack span').count(), PILOT_EXPECTED_GROUP_SIZE);
    assert.deepEqual(externalRequests, []); await noOverflow();
    await page.screenshot({ path: artifact('palau-mobile-home.png'), fullPage: true });
  });
  await check('shared ownership and personal checklist controls work', async () => {
    await section('Checklists').click();
    assert.equal(await page.getByRole('checkbox', { name: 'Complete Check boat meeting point', exact: true }).isDisabled(), true);
    const own = page.getByRole('checkbox', { name: 'Complete Pack reef-friendly essentials', exact: true });
    await own.click();
    assert.equal(await page.getByRole('checkbox', { name: 'Uncheck Pack reef-friendly essentials', exact: true }).getAttribute('aria-checked'), 'true');
    await actor('organizer');
    assert.equal(await page.getByRole('checkbox', { name: 'Complete Check boat meeting point', exact: true }).isEnabled(), true);
    assert.equal(await page.getByText('Pack reef-friendly essentials', { exact: true }).count(), 0);
    await page.getByRole('checkbox', { name: 'Complete Check boat meeting point', exact: true }).click();
    await actor('traveler-a'); await noOverflow();
  });
  await check('RSVP capacity, repeated actions and organizer-only plan status are distinct', async () => {
    await section('The plan').click();
    const full = page.locator('.palau-activity').filter({ has: page.getByRole('heading', { name: 'Small-group reef morning' }) });
    assert.equal(await full.getByRole('button', { name: 'Going', exact: true }).isDisabled(), true);
    await full.getByRole('button', { name: 'Maybe', exact: true }).click();
    assert.equal(await full.getByRole('button', { name: 'Maybe', exact: true }).getAttribute('aria-pressed'), 'true');
    await full.getByRole('button', { name: 'Maybe', exact: true }).click();
    assert.match(await full.innerText(), /2\/2/);
    assert.equal(await page.getByRole('button', { name: /Organizer: confirm/ }).count(), 0);
    await actor('traveler-b'); await full.getByRole('button', { name: 'Not going', exact: true }).click();
    await actor('traveler-a'); await full.getByRole('button', { name: 'Going', exact: true }).click();
    assert.match(await full.innerText(), /2\/2/);
    await actor('organizer');
    const kayak = page.locator('.palau-activity').filter({ has: page.getByRole('heading', { name: 'Rock Islands by kayak' }) });
    await kayak.getByRole('button', { name: 'Organizer: confirm group plan' }).click();
    assert.match(await kayak.innerText(), /Plan confirmed/);
    await actor('traveler-a'); await noOverflow();
    await page.screenshot({ path: artifact('palau-mobile-plan.png'), fullPage: true });
  });
  await check('all eight sample views see only their own personal checklist', async () => {
    assert.equal(PILOT_TRAVELERS.length, PILOT_EXPECTED_GROUP_SIZE);
    await section('Checklists').click();
    for (const person of PILOT_TRAVELERS) {
      await actor(person.id);
      await page.getByText(`Viewing as ${person.name}`, { exact: true }).waitFor();
      const ownTitles = new Set(INITIAL_TASKS.filter(task => task.scope === 'personal' && task.ownerId === person.id).map(task => task.title));
      assert.ok(ownTitles.size >= 1, `${person.name} has a personal item`);
      for (const title of ownTitles) {
        assert.equal(await page.getByText(title, { exact: true }).count(), 1, `${person.name} sees own item "${title}"`);
        assert.equal(await page.getByRole('checkbox', { name: new RegExp(`^(Complete|Uncheck) ${title}$`) }).isEnabled(), true);
      }
      for (const task of INITIAL_TASKS.filter(task => task.scope === 'personal' && task.ownerId !== person.id && !ownTitles.has(task.title))) {
        assert.equal(await page.getByText(task.title, { exact: true }).count(), 0, `${person.name} must not see ${task.ownerId}'s "${task.title}"`);
      }
      await noOverflow();
    }
    await actor('traveler-a');
  });
  await check('a four-seat table fills at four of eight travelers and frees on decline', async () => {
    await section('The plan').click();
    const table = page.locator('.palau-activity').filter({ has: page.getByRole('heading', { name: 'A table at sunset' }) });
    assert.match(await table.innerText(), /3\/4/);
    await actor('traveler-d'); await table.getByRole('button', { name: 'Going', exact: true }).click();
    assert.match(await table.innerText(), /4\/4/); assert.match(await table.innerText(), /Full/);
    await actor('traveler-e');
    assert.equal(await table.getByRole('button', { name: 'Going', exact: true }).isDisabled(), true);
    await table.getByRole('button', { name: 'Maybe', exact: true }).click();
    assert.equal(await table.getByRole('button', { name: 'Maybe', exact: true }).getAttribute('aria-pressed'), 'true');
    await actor('traveler-d'); await table.getByRole('button', { name: 'Not going', exact: true }).click();
    assert.match(await table.innerText(), /3\/4/);
    await actor('traveler-e'); await table.getByRole('button', { name: 'Going', exact: true }).click();
    assert.match(await table.innerText(), /4\/4/);
    await actor('traveler-a'); await noOverflow();
  });
  await check('journal reuses VYBR card, escapes text, keeps Palau time and limits deletes to author', async () => {
    await section('Journal').click();
    const memory = '<script>alert(1)</script> Sample sunset';
    await page.getByLabel('A sample memory', { exact: true }).fill(memory);
    await page.getByRole('button', { name: 'Add sample memory' }).click();
    await page.getByText(memory, { exact: true }).waitFor();
    assert.match(await page.locator('.palau-journal-entries').innerText(), /5:00 PM/);
    assert.equal(await page.locator('.palau-journal-entries script').count(), 0);
    assert.equal(await page.getByRole('button', { name: 'Add sample memory' }).isDisabled(), true);
    await actor('traveler-c');
    assert.equal(await page.locator('.palau-journal-entries').getByRole('button', { name: 'Delete', exact: true }).count(), 0);
    await actor('traveler-a');
    await page.locator('.palau-journal-entries').getByRole('button', { name: 'Delete', exact: true }).click();
    assert.equal(await page.getByText(memory, { exact: true }).count(), 0);
    await noOverflow();
  });
  await check('essentials download and print contain no identities or personal state', async () => {
    await section('Essentials').click();
    const downloading = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download sample essentials', exact: true }).click();
    const download = await downloading; assert.equal(download.suggestedFilename(), 'palau-sample-essentials.txt');
    const saved = artifact('palau-sample-essentials.txt');
    await download.saveAs(saved);
    const text = await readFile(saved, 'utf8');
    assert.match(text, /SAMPLE ESSENTIALS/); assert.match(text, /Pacific\/Palau/);
    assert.doesNotMatch(text, /Traveler A|Traveler B|Sample sunset|@/);
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('.palau-print-only').isVisible(), true);
    assert.equal(await page.locator('.palau-header').isVisible(), false);
    await page.emulateMedia({ media: 'screen' }); await noOverflow();
  });
  await check('browser Back and Forward restore the chosen section', async () => {
    await section('The plan').click(); await section('Journal').click();
    await page.goBack(); await page.getByRole('heading', { name: 'What sounds like you?' }).waitFor();
    await page.goForward(); await page.getByRole('heading', { name: 'The things we’ll remember.' }).waitFor();
  });
  await check('section navigation works from the keyboard', async () => {
    await section('Overview').focus(); await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: /Less coordinating/ }).waitFor();
    await section('Journal').focus(); await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: 'The things we’ll remember.' }).waitFor();
  });
  await check('nonmember and logged-out previews hide member content and clearly disclose simulation', async () => {
    await actor('nonmember');
    await page.getByRole('heading', { name: 'This one is members only.' }).waitFor();
    assert.equal(await page.getByRole('navigation', { name: 'Sample trip sections' }).count(), 0);
    assert.match(await page.locator('main').innerText(), /UI simulation/);
    await actor('logged-out'); await page.getByRole('heading', { name: 'Your trip stays with your group.' }).waitFor();
    await page.getByRole('button', { name: 'Explore the sample as Traveler A' }).click();
  });
  await check('reset and refresh discard sample edits; no local storage or geolocation', async () => {
    await page.getByRole('button', { name: /Reset demo/ }).click();
    await section('The plan').click();
    const kayak = page.locator('.palau-activity').filter({ has: page.getByRole('heading', { name: 'Rock Islands by kayak' }) });
    assert.match(await kayak.innerText(), /Proposed/);
    await page.reload({ waitUntil: 'networkidle' });
    assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
    assert.deepEqual(await page.evaluate(() => Object.keys(sessionStorage)), []);
    assert.equal(await page.evaluate(() => window.__pilotGeolocationRequests), 0);
  });
  await check('320px phone and 1440px desktop layouts do not overflow', async () => {
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const label of ['Overview', 'The plan', 'Checklists', 'Journal', 'Essentials']) { await section(label).click(); await noOverflow(); }
    }
    await section('Overview').click();
    await page.screenshot({ path: artifact('palau-desktop-home.png'), fullPage: true });
  });
  await check('disabled real private access fails closed without credentials or sample fallback', async () => {
    await page.goto(`${base}/pilot/private/00000000-0000-4000-8000-000000000001`, { waitUntil: 'networkidle' });
    await page.getByText(/The private backend has not been enabled/).waitFor();
    assert.equal(await page.getByText('Verified role:', { exact: false }).count(), 0);
    await page.goto(`${base}/pilot/invite#token=${'a'.repeat(64)}`, { waitUntil: 'networkidle' });
    await page.getByText(/The private backend has not been enabled/).waitFor();
    assert.equal(new URL(page.url()).hash, '');
    assert.equal(await page.getByRole('button', { name: 'Accept invitation', exact: true }).count(), 0);
    assert.deepEqual(externalRequests, []);
  });
  assert.deepEqual(pageErrors, []);
  console.log(`\n${passed} browser scenarios passed. No external requests. No uncaught browser errors. Local QA artifacts: ${output}`);
} finally { await browser.close(); }
