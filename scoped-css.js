export async function addStyles(cssText) {
  const stylesheet = new CSSStyleSheet();
  document.adoptedStyleSheets.push(stylesheet);
  await stylesheet.replace(String(cssText));
}

const scopeAttributeName = 'data-css-scope';

class ScopedCSSAttribute {
  constructor(scopeName) {
    this[scopeAttributeName] = scopeName;
  }

  get scope() {
    return this[scopeAttributeName];
  }

  get selector() {
    return `[${scopeAttributeName}=${CSS.escape(this[scopeAttributeName])}]`;
  }

  get passthrough() {
    const { selector } = this;

    // Adds styles that "pass-through" descendants with a "data-css-scope"
    // attribute. Pass-through styles can be useful for containers that need
    // to supply styling to children (e.g. flex properties) that might
    // themselves define a style scope.
    function css(callSite, ...values) {
      addStyles(`
        @scope (${selector}) {
          ${String.raw(callSite, ...values)}
        }
      `);
    }

    return { css };
  }
}

let nextScopeID = 0x5c09ed;

// A template tag that adds scoped CSS to the document. The provided CSS text
// is wrapped with a "@scope" at-rule and only applies to elements with a
// "data-css-scope" attribute whose value matches `scopeName`. The CSS rules do
// not apply to any descendant elements that have a "data-css-scope" attribute.
// Returns an object representing the CSS scope data attribute.
export const scoped = {
  css(callSite, ...values) {
    const id = (nextScopeID++).toString(36);
    const attr = new ScopedCSSAttribute(id);
    addStyles(`
      @scope (${attr.selector}) to ([${scopeAttributeName}]) {
        ${String.raw(callSite, ...values)}
      }
    `);
    return attr;
  },
};
