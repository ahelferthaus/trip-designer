import test from 'node:test';
import assert from 'node:assert/strict';
import {tryCopyInvitation} from '../src/lib/invitationClipboard.ts';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
test('copy reports success only after the write succeeds',async()=>{
 let resolve;const result=tryCopyInvitation(()=>new Promise(r=>{resolve=r;}));let completed=false;void result.then(()=>{completed=true;});
 await Promise.resolve();assert.equal(completed,false);resolve();assert.equal(await result,'copied');
});
test('missing clipboard, synchronous exceptions and rejected writes give a safe fallback',async()=>{
 for(const write of [()=>{throw new TypeError('missing API');},async()=>{throw new Error('private clipboard detail');}]) assert.equal(await tryCopyInvitation(write),'unavailable');
});
const source=await readFile(new URL('../src/pages/InvitationLinkCard.tsx',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext}}).outputText
.replaceAll('"react/jsx-runtime"',JSON.stringify(import.meta.resolve('react/jsx-runtime'))).replace("'react'",JSON.stringify(import.meta.resolve('react')))
.replace("'../lib/invitationClipboard'",JSON.stringify(new URL('../src/lib/invitationClipboard.ts',import.meta.url).href));
const {default:Card}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
test('invitation renders labeled readonly link, distinct real buttons and live feedback',()=>{
 const html=renderToStaticMarkup(createElement(Card,{recipient:'fictional@example.test',link:'https://example.test/pilot/invite#token=SYNTHETIC-NOT-VALID',onHide:()=>{}}));
 assert.match(html,/<textarea[^>]*readOnly/);assert.match(html,/<label for=/);
 assert.match(html,/class="private-invitation-copy" type="button"/);assert.match(html,/class="private-invitation-hide" type="button"/);
 assert.match(html,/role="status" aria-live="polite"/);assert.match(html,/does not send an email/);
});
test('scoped styles provide visible controls, spacing, wrapping, focus and narrow-screen stacking',async()=>{
 const css=await readFile(new URL('../src/pages/private-trip-workspace.css',import.meta.url),'utf8');
 for(const pattern of [/\.private-invitation-actions[^}]*gap: 12px/,/\.private-invitation-actions > button[^}]*min-height: 44px/,/\.private-invitation-copy[^}]*background: #245e50/,/\.private-invitation-card > textarea[^}]*width: 100%/,/\.private-invitation-card :focus-visible/,/max-width: 480px/])assert.match(css,pattern);
});
