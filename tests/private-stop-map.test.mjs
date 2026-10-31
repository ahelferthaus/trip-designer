import test from 'node:test';
import assert from 'node:assert/strict';
import {buildStopMap,validCoordinates} from '../src/lib/privateStopMap.ts';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const stop=(id,latitude,longitude,extra={})=>({id,tripId:'t',shared:true,label:`Stop ${id}`,coordinates:{latitude,longitude},...extra});
test('coordinates require finite numeric ranges, including valid zero and poles',()=>{
  for(const pair of [[0,0],[90,180],[-90,-180]]) assert.equal(validCoordinates({latitude:pair[0],longitude:pair[1]}),true);
  for(const pair of [[91,0],[0,181],[NaN,0],[0,Infinity],['1',2],[null,0]]) assert.equal(validCoordinates({latitude:pair[0],longitude:pair[1]}),false);
});
test('map excludes cross-trip and unshared stops including their labels; drops extra fields',()=>{
  const m=buildStopMap('t',[stop('a',0,0,{privateNote:'SECRET'}),stop('x',1,2,{tripId:'other',label:'SECRET'}),stop('y',1,2,{shared:false,label:'SECRET'}),stop('a',5,5)]);
  assert.equal(m.points.length,1); assert.doesNotMatch(JSON.stringify(m),/SECRET|privateNote/);
});
test('unknown points remain unmapped and never fabricate a segment over the gap',()=>{
  const m=buildStopMap('t',[stop('a',0,0),stop('b',NaN,0),stop('c',1,1)]);
  assert.equal(m.points[1].x,null); assert.equal(m.points[1].coordinate,null); assert.equal(m.segments.length,0);
});
test('dateline uses a short longitude interval, with correct eastward and northward directions',()=>{
  const m=buildStopMap('t',[stop('a',10,179),stop('b',11,-179)]);
  assert.equal(m.bounds.east-m.bounds.west,3);
  assert.ok(m.points[0].x<m.points[1].x); assert.ok(m.points[0].y>m.points[1].y);
  assert.equal(m.segments.length,1);
});
test('single and identical points have finite projections; empty stops have no markers',()=>{
  for(const stops of [[stop('a',90,180)],[stop('a',0,0),stop('b',0,0)]]) {
    const m=buildStopMap('t',stops); for(const p of m.points) assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
  }
  assert.equal(buildStopMap('t',[]).locatedCount,0);
});
const source=await readFile(new URL('../src/pages/PrivateStopMap.tsx',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext}}).outputText
.replaceAll('"react/jsx-runtime"',JSON.stringify(import.meta.resolve('react/jsx-runtime')))
.replace("'react'",JSON.stringify(import.meta.resolve('react')))
.replace("'../lib/privateStopMap'",JSON.stringify(new URL('../src/lib/privateStopMap.ts',import.meta.url).href));
const {default:Component}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
test('map render is accessible, escapes labels, has no external assets, and labels missing locations',()=>{
  const html=renderToStaticMarkup(createElement(Component,{tripId:'t',stops:[stop('a',0,0,{label:'<script>private</script>'}),stop('b',NaN,0)]}));
  assert.match(html,/role="img"/);assert.match(html,/&lt;script&gt;/);assert.match(html,/Unmapped/);
  assert.doesNotMatch(html,/<script|<image|<iframe|href=|src=/);
  assert.match(html,/not roads, distances or places visited/);
  const empty=renderToStaticMarkup(createElement(Component,{tripId:'t',stops:[]}));
  assert.match(empty,/No shared stop coordinates/);assert.doesNotMatch(empty,/<svg/);
});
test('projection-cut segments and partial projections never fabricate connecting paths',()=>{
  const cut=buildStopMap('t',[stop('a',0,0),stop('b',0,120),stop('c',0,-120)]);
  assert.equal(cut.segments.length,1);
  const partial=buildStopMap('t',[stop('a',0,0),stop('hidden',0,1,{shared:false}),stop('b',0,2)]);
  assert.equal(partial.points.length,2); assert.equal(partial.segments.length,0);
  assert.equal(buildStopMap('t',[stop('a',0,0),stop('b',0,0)]).segments.length,0);
});
