export function addStyles(cssText: string): Promise<void>

export class ScopedCSSAttribute {
  get scope(): string
  get selector(): string
  get passthrough(): {
    css: (callSite: TemplateStringsArray, ...values: any[]) => void
  }
}

export const scoped: {
  css: (callSite: TemplateStringsArray, ...values: any[]) => ScopedCSSAttribute
}
