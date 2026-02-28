# scoped-css

Minimal CSS-in-JS using `@scope`.

## Usage

```js
import { scoped } from '@zenparsing/scoped-css';

const style = scoped.css`
  & {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`

style.passthrough.css`
  & > * {
    flex: 0 1 auto;
  }
`

class Elem extends HTMLElement {
  constructor() {
    super();
    this.setAttribute('data-css-scope', style.scope)
  }
}
```

## API

### scoped.css``

A template tag that adds scoped CSS to the document. The provided CSS text is wrapped
with a `@scope` at-rule and only applies to elements with a `data-css-scope` attribute
whose value matches the generated scope name. The CSS rules do not apply to any descendant
elements that have a `data-css-scope` attribute. Returns a `ScopedCSSAttribute` object
representing the CSS scope data attribute.

### (ScopedCSSAttribute).scope

The unique auto-generated name of the CSS scope. This should be supplied as the value
of the `data-css-scope` attribute of the styled element.

### (ScopedCSSAttribute).selector

A CSS selector that will match elements targeted by this CSS scope.

### (ScopedCSSAttribute).passthrough.css``

Adds styles that "pass-through" descendants with a `data-css-scope` attribute.
Pass-through styles can be useful for containers that need to supply styling to
children (e.g. flex properties) that might themselves define a style scope.
