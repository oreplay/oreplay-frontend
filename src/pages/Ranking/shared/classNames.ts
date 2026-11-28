const CLASS_NAMES_SEPARATOR = ", "

const CLASS_NAME_PATTERN = /^[FMWD]-(\d{2}|E)[ABC]?$/

export function formatClassNames(classNames: string[] | null | undefined): string {
  return (classNames ?? []).join(CLASS_NAMES_SEPARATOR)
}

export function isKnownClassNamePattern(className: string): boolean {
  return CLASS_NAME_PATTERN.test(className)
}

export function parseClassNames(text: string): string[] {
  return text
    .split(",")
    .map((className) => className.trim())
    .filter((className) => className.length > 0)
}
