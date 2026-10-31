import test from 'node:test';
import assert from 'node:assert/strict';
import {operationalTime,timelineRange,visibleOperationalTravelers,landNights} from '../src/lib/groupOverview.ts';
import {groupOverviewFixture as fixture} from './fixtures/group-overview.mjs';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
test('overview never includes private or other-trip travelers',()=>{
 const data=structuredClone(fixture); data.travelers.push({...data.travelers[0],id:'secret',name:'PRIVATE NAME',visibility:'private'},{...data.travelers[0],id:'foreign',name:'OTHER NAME',tripId:'other'});
 assert.equal(visibleOperationalTravelers(data).length,8);
 assert.doesNotMatch(JSON.stringify(visibleOperationalTravelers(data)),/PRIVATE NAME|OTHER NAME/);
});
test('times preserve event timezone and reject malformed, absent, or unshared values',()=>{
 assert.match(operationalTime({at:'2030-11-01T05:30:00Z',zone:'Pacific/Palau',status:'confirmed'}),/2:30 PM/);
 for(const at of ['2030-02-30T10:00:00Z','2030-11-01','2030-11-01T24:00:00Z',null]) assert.equal(operationalTime({at,zone:'UTC',status:'confirmed'}),'Not provided');
 assert.equal(operationalTime({at:'2030-11-01T05:30:00Z',zone:'bad',status:'confirmed'}),'Time zone needs confirmation');
 assert.equal(operationalTime({at:'2030-11-01T05:30:00Z',zone:'UTC',status:'not_provided'}),'Not provided');
});
test('timeline clips explicitly and never invents presence for incomplete or reversed plans',()=>{
 const a='2030-01-01T00:00:00Z',b='2030-01-03T00:00:00Z';
 assert.deepEqual(timelineRange(a,b,'2029-12-31T00:00:00Z',b),{left:0,width:100,clipped:true});
 assert.equal(timelineRange(a,b,a,null),null);assert.equal(timelineRange(a,b,b,a),null);
 assert.equal(timelineRange(a,a,a,b),null);
});
test('hotel nights use calendar dates, not DST hours, and reject bad ranges',()=>{
 assert.equal(landNights({kind:'land',start:'2030-11-02',end:'2030-11-04'}),'2 nights');
 assert.equal(landNights({kind:'land',start:'2030-02-30',end:'2030-03-04'}),'');
 assert.equal(landNights({kind:'land',start:'2030-11-04',end:'2030-11-02'}),'');
});
const source=await readFile(new URL('../src/pages/GroupTripOverview.tsx',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext}}).outputText
.replaceAll('"react/jsx-runtime"',JSON.stringify(import.meta.resolve('react/jsx-runtime'))).replace("'react'",JSON.stringify(import.meta.resolve('react')))
.replace("'../lib/groupOverview'",JSON.stringify(new URL('../src/lib/groupOverview.ts',import.meta.url).href)).replace("import './group-overview.css';",'');
const {default:Overview}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
test('roster renders explicit room/response states, semantic table and mobile cards without private fields',()=>{
 const data=structuredClone(fixture); data.travelers[0].privateNote='SECRET NOTE';data.travelers[0].name='<script>x</script>';
 data.travelers.push({...data.travelers[0],id:'private',visibility:'private',name:'SECRET PERSON'});
 const html=renderToStaticMarkup(createElement(Overview,{data}));
 for(const text of ['scope="col"','scope="row"','go-mobile','Solo','Shared','Sharing unassigned','Not joining','Not provided','Tentative','Confirmed','Pacific/Palau','2 nights']) assert.ok(html.includes(text),text);
 assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/SECRET|<script|https:\/\//);
 assert.match(html,/not live location/);
});
test('overview empty state does not reveal the number of hidden travelers',()=>{
 const data=structuredClone(fixture);data.travelers.forEach(t=>t.visibility='private');
 const html=renderToStaticMarkup(createElement(Overview,{data}));assert.match(html,/No shared traveler plans yet/);assert.doesNotMatch(html,/Traveler A/);
});
