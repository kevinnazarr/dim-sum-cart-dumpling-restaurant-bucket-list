declare module 'jest-axe' {
  export function axe(container: Element, options?: unknown): Promise<{ violations: unknown[] }>
  export const toHaveNoViolations: unknown
}
