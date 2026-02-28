let adoptedStyleSheets = [];

class CSSStyleSheet {
  constructor() {
    this.text = ''
  }

  async replace(text) {
    this.text = text
  }
}

Object.assign(global, {
  CSSStyleSheet,
  document: { adoptedStyleSheets },
  CSS: {
    escape(str) { return str; }
  }
});

export function getStyleSheets() {
  return adoptedStyleSheets.map((sheet) => sheet.text);
}

export function clearStyleSheets() {
  adoptedStyleSheets.length = 0;
}
