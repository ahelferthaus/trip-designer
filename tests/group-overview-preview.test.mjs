import test from 'node:test';
import assert from 'node:assert/strict';
import {withSampleFriends} from '../src/lib/groupOverviewPreview.ts';
import {groupOverviewFixture} from './fixtures/group-overview.mjs';
const first=()=>({...structuredClone(groupOverviewFixture),travelers:[structuredClone(groupOverviewFixture.travelers[0])]});
test('preview adds exactly seven labeled samples without mutating or duplicating first traveler',()=>{
 const base=first(),before=JSON.stringify(base),result=withSampleFriends(base,'sample-0');
 assert.equal(result.travelers.length,8);assert.equal(result.travelers[0],base.travelers[0]);
 assert.equal(result.travelers.filter(t=>t.name.startsWith('Sample friend ')).length,7);
 assert.equal(new Set(result.travelers.map(t=>t.id)).size,8);assert.equal(JSON.stringify(base),before);
 assert.ok(result.travelers.some(t=>!t.arrival));assert.ok(result.travelers.some(t=>t.rooms.some(r=>r.sharing==='solo')));
});
test('preview refuses wrong identity, multiple real travelers, private profiles and invalid windows',()=>{
 assert.equal(withSampleFriends(first(),'other'),null);
 assert.equal(withSampleFriends(groupOverviewFixture,'sample-0'),null);
 const hidden=first();hidden.travelers[0].visibility='private';assert.equal(withSampleFriends(hidden,'sample-0'),null);
 const bad=first();bad.zone='invalid';assert.equal(withSampleFriends(bad,'sample-0'),null);
 bad.zone='UTC';bad.end=bad.start;assert.equal(withSampleFriends(bad,'sample-0'),null);
});
test('sample generation has no persistence, account, invitation, or network operations',async()=>{
 const {readFile}=await import('node:fs/promises');
 for(const path of ['../src/lib/groupOverviewPreview.ts','../src/pages/GroupOverviewPreview.tsx']) {
 const source=await readFile(new URL(path,import.meta.url),'utf8');
 assert.doesNotMatch(source,/fetch\s*\(|localStorage|sessionStorage|\.rpc\s*\(|\.insert\s*\(|\.signUp\s*\(|\.inviteUser/);
 }
});
