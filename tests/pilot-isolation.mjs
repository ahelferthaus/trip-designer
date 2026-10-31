import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
const assets = await readdir(new URL('../dist/assets/',import.meta.url));
async function inspect(directory) {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const path=new URL(entry.name+(entry.isDirectory()?'/':''),directory);
    if(entry.isDirectory()) await inspect(path);
    else assert.doesNotMatch(entry.name,/^(?:sw|service-worker)\.|\.env|private.*\.sql$/i,'Unexpected deployable artifact');
  }
}
await inspect(new URL('../dist/',import.meta.url));
assert.ok(assets.some(name=>name.startsWith('PilotSignInPage-')));
for(const name of assets) {
  assert.doesNotMatch(name,/LegacyApp|AuthPage|mapbox|jspdf|html2canvas/);
  if(name.endsWith('.js')) {
    const text=await readFile(new URL(`../dist/assets/${name}`,import.meta.url),'utf8');
    for(const marker of ['migrateLocalTripsToCloud','/onboarding','VITE_SUPABASE_URL','api.openai.com']) assert.equal(text.includes(marker),false,`${name} contains ${marker}`);
  }
}
console.log('Pilot-only build excludes legacy entry, authentication, migration and large provider bundles.');
