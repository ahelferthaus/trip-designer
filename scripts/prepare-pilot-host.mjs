// Produce a static-only Vercel Build Output artifact. This does not deploy it.
import { mkdir, cp, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve('.');
const output = resolve(root, '.vercel/output');
// Refuse stale outputs rather than carrying old functions into a static deployment.
try { await access(output); throw new Error('Build output already exists. Use a fresh checkout/output directory to prepare a new pilot artifact.'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(output, { recursive: true });
await cp(resolve(root, 'dist'), resolve(output, 'static'), { recursive: true });
await writeFile(resolve(output, 'config.json'), JSON.stringify({ version: 3, routes: [
  { src: '/(.*)', headers: { 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()' }, continue: true },
  { handle: 'filesystem' },
  { src: '/(.*)', dest: '/index.html' },
] }, null, 2));
console.log('Prepared static-only .vercel/output (no server functions). Hosting changes still require approval.');
