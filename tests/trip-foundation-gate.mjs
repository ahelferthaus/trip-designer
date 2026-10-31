import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
const mode=process.argv[2];
assert.ok(['enabled','disabled'].includes(mode),'Specify expected foundation gate state');
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const script=html.match(/<script[^>]+src="(\/assets\/[^"]+\.js)"/);
assert.ok(script,'Built entry module is present');
const entry=await readFile(new URL('../dist'+script[1],import.meta.url),'utf8');
assert.equal(/path:["`']\/pilot\/trips["`']/.test(entry),mode==='enabled','Compiled router matches intended rollout gate');
console.log(`General dashboard route: ${mode}; build gate verified.`);

const files=await readdir(new URL('../dist/assets/',import.meta.url));
assert.equal(files.some(name=>/^TripDashboardPage-.*\.js$/.test(name)),mode==='enabled','Disabled builds omit dashboard implementation');
