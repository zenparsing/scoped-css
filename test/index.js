import { getStyleSheets, clearStyleSheets } from './setup.js'

import * as assert from 'node:assert';
import { describe, it, beforeEach } from 'moon-unit';
import { addStyles, scoped } from '../scoped-css.js';

beforeEach(() => {
  clearStyleSheets();
});

describe('addStyles', () => {
  it('should add adopted stylesheets', async () => {
    await addStyles('h1 {}');
    await addStyles('p {}');
    assert.deepEqual(getStyleSheets(), ['h1 {}', 'p {}']);
  });
});

describe('scoped.css', () => {
  it('should create scoped styles and return an attribute object', async () => {
    const attr = scoped.css`
      & {
        color: red;
        font-size: 16px;
      }
    `;

    assert.ok(attr.scope);
    assert.strictEqual(attr['data-css-scope'], attr.scope);
    assert.strictEqual(attr.selector, `[data-css-scope=${attr.scope}]`);

    await Promise.resolve();

    const sheets = getStyleSheets();
    assert.strictEqual(sheets.length, 1);
    assert.ok(sheets[0].includes(`@scope (${attr.selector}) to ([data-css-scope])`));
    assert.ok(sheets[0].includes('color: red;'));
  });
});

describe('passthrough', () => {
  it('should attach styles without a lower boundary', async () => {
    const attr = scoped.css``;

    attr.passthrough.css`
      & { display: flex; }
    `;

    await Promise.resolve();

    const sheets = getStyleSheets();
    assert.strictEqual(sheets.length, 2);
    assert.ok(sheets[1].includes(`@scope (${attr.selector}) {`));
    assert.ok(!sheets[1].includes('to ([data-css-scope])'));
    assert.ok(sheets[1].includes('display: flex;'));
  });
});
