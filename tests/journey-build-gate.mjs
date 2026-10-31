import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
const mode = process.argv[2];
assert.ok(['enabled', 'disabled'].includes(mode));
const files = await readdir(new URL('../dist/assets/', import.meta.url));
assert.equal(files.some(name => /^PrivateJourney-.*\.js$/.test(name)), mode === 'enabled', 'Unreleased journey implementation must be absent when disabled');
console.log(`Shared journey bundle gate verified: ${mode}`);
