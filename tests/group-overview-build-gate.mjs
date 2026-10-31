import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
const assets=await readdir(new URL('../dist/assets/',import.meta.url));
for(const file of assets.filter(name=>name.endsWith('.js'))) {
 const body=await readFile(new URL(`../dist/assets/${file}`,import.meta.url),'utf8');
 for(const marker of ['Sample friend A','sample-preview-','SAMPLE PREVIEW · seven fictional friends','First traveler · synthetic profile']) assert.equal(body.includes(marker),false,`${file} includes an unreleased overview fixture`);
}
console.log('Unreleased group preview and synthetic friends are absent from production bundles.');
