import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { pilotToken, pilotDestination, pilotCallback } from '../src/lib/pilotAuth.ts';
import { acceptPrivateTripInvite } from '../src/lib/privateTripAccess.ts';
const source = await readFile(new URL('../src/pages/PrivateAccountReady.tsx', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext } }).outputText.replace('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
const { PrivateAccountReady } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
test('confirmed account without invitation has useful next steps and no acceptance controls', () => {
 const html=renderToStaticMarkup(createElement(PrivateAccountReady));
 assert.match(html,/Your account is confirmed/);
 assert.match(html,/does not join a trip/);
 assert.match(html,/separate invitation link/);
 assert.match(html,/saved trip link/);
 assert.match(html,/reopen the original invitation link/);
 assert.doesNotMatch(html,/<form|<input|<button|configuration-gated|staging|Create a trip/);
});
test('confirmation callback and reloaded scrubbed URL cannot manufacture an invitation', async()=>{
 const calls=[];const client={auth:{getUser:async()=>{calls.push('auth');}},rpc:async()=>{calls.push('rpc');}};
 for(const hash of ['', '#error_code=otp_expired', '#access_token=not-an-invitation', '#token=invalid']) {
  const token=pilotToken(hash);
  assert.equal(token,'');assert.equal(pilotDestination('/pilot/invite',token),'/pilot/invite');
  await assert.rejects(acceptPrivateTripInvite(client,token,'Sample'),/valid invitation/);
 }
 assert.deepEqual(calls,[]);
 assert.equal(pilotCallback('?code=confirmation-only','').hadCode,true);
});
test('valid invite survives in-memory sign-in handoff but expiry and switched identity remain server enforced',async()=>{
 const token='b'.repeat(64);const trip='10000000-0000-4000-8000-000000000001';
 assert.equal(pilotToken(new URL(pilotDestination('/pilot/invite',token),'https://example.test').hash),token);
 let identity='invited';const seen=[];
 const client={auth:{getUser:async()=>({data:{user:{id:identity,email_confirmed_at:'2030-01-01',is_anonymous:false}},error:null})},rpc:async()=>{seen.push(identity);return identity==='invited'?{data:trip,error:null}:{data:null,error:{message:'expired or wrong recipient'}};}};
 assert.equal(await acceptPrivateTripInvite(client,token,'Sample'),trip);
 identity='other';await assert.rejects(acceptPrivateTripInvite(client,token,'Sample'),/Invitation unavailable/);
 assert.deepEqual(seen,['invited','other']);
 client.rpc=async()=>({data:null,error:{message:'expired'}});
 await assert.rejects(acceptPrivateTripInvite(client,token,'Sample'),/Invitation unavailable/);
});
