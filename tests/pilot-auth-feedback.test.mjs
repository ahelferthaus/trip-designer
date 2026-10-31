import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const source = await readFile(new URL('../src/pages/PilotAuthFeedback.tsx', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext } }).outputText.replace('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
const { PilotAuthFeedback } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const render = props => renderToStaticMarkup(createElement(PilotAuthFeedback, { confirmation: false, signup: false, message: '', onReturn() {}, ...props }));
test('signup confirmation gives a distinct next step without claiming delivery or granting access', () => {
  const html = render({ confirmation: true, signup: true });
  assert.match(html, /<h2>Check your email<\/h2>/);
  assert.match(html, /If this address can be registered/);
  assert.match(html, /inbox and spam/);
  assert.match(html, /does not create a trip or grant organizer access/);
  assert.match(html, /Return to sign in/);
  assert.doesNotMatch(html, /<input|type="submit"|email has been delivered/i);
});
test('unconfirmed login does not imply a new message was sent', () => {
  const html = render({ confirmation: true });
  assert.match(html, /earlier signup/);
  assert.doesNotMatch(html, /signup request was received/);
});
test('errors remain prominent and escape backend-looking text', () => {
  const html = render({ message: '<script>example</script>' });
  assert.match(html, /Action needed/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.equal(render({}), '');
});
