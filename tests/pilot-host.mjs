import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, readFile, writeFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('static packaging rejects stale output and legacy assets and emits no functions', async () => {
  const directory=await mkdtemp(join(tmpdir(),'palau-static-test-'));
  await mkdir(join(directory,'scripts'));
  await mkdir(join(directory,'tests'));
  await cp(new URL('../dist/',import.meta.url),join(directory,'dist'),{recursive:true});
  await cp(new URL('../scripts/prepare-pilot-host.mjs',import.meta.url),join(directory,'scripts/prepare-pilot-host.mjs'));
  await cp(new URL('./pilot-isolation.mjs',import.meta.url),join(directory,'tests/pilot-isolation.mjs'));
  const run=()=>spawnSync(process.execPath,['scripts/prepare-pilot-host.mjs'],{cwd:directory,encoding:'utf8'});
  const first=run(); assert.equal(first.status,0,first.stderr);
  assert.deepEqual((await readdir(join(directory,'.vercel/output'))).sort(),['config.json','static']);
  const config=JSON.parse(await readFile(join(directory,'.vercel/output/config.json'),'utf8'));
  assert.equal(config.version,3);
  assert.equal(config.routes[0].headers['Content-Security-Policy'],"frame-ancestors 'none'");
  const stale=run(); assert.notEqual(stale.status,0); assert.match(stale.stderr,/already exists/);
  await writeFile(join(directory,'dist/assets/LegacyApp-test.js'),'export const legacy = true;');
  const legacy=run(); assert.notEqual(legacy.status,0); assert.match(legacy.stderr,/LegacyApp/);
});
