# scoped-css

Minimal CSS-in-JS using [`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope).

## Install

```
npm install @zenparsing/scoped-css
```

## Usage

`scoped.css` creates a scoped stylesheet and returns an attribute object. Apply the
scope to an element by setting `data-css-scope` to `style.scope`. Styles are isolated
to the scoped element and its descendants — but stop at any nested scope boundary.

```js
import { scoped } from '@zenparsing/scoped-css';

const style = scoped.css`
  & {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .description {
    color: #555;
    line-height: 1.5;
  }
`;
```

### Web Components

Set the attribute in the constructor:

```js
class UserCard extends HTMLElement {
  constructor() {
    super();
    this.setAttribute('data-css-scope', style.scope);
  }
}
```

### React

The attribute object spreads directly into JSX:

```jsx
function UserCard({ name, bio }) {
  return (
    <div {...style}>
      <h2>{name}</h2>
      <p className="description">{bio}</p>
    </div>
  );
}
```

### Passthrough Styles

By default, scoped styles stop at descendant scope boundaries. Use `passthrough` to
style through them - useful for layout properties like flex:

```js
style.passthrough.css`
  & > * {
    flex: 0 1 auto;
  }
`;
```

## API

### `scoped.css`\`cssText\`

Template tag that adds scoped CSS to the document. The CSS is wrapped in a `@scope`
at-rule targeting `[data-css-scope=<id>]` with a lower boundary at any descendant
`[data-css-scope]`. Returns a `ScopedCSSAttribute` object.

### ScopedCSSAttribute

| Property | Description |
|---|---|
| `scope` | The generated scope name. Set this as the value of `data-css-scope`. |
| `selector` | CSS selector matching the scoped element. |
| `passthrough.css`\`\` | Adds styles without a lower scope boundary (styles pass through to nested scopes). |

The object also has a `data-css-scope` own property equal to `scope`, so it can be
spread directly as JSX attributes.

### `addStyles(cssText)`

Adds a plain stylesheet to the document (via `document.adoptedStyleSheets`). Use this
for CSS that can't be nested inside `@scope`, such as `@property`, `@font-face`, or
`@keyframes`.
