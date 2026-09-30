export const AUTOCOMPLETE_LIST_LAYOUTS = ["list", "wrap"] as const
export type AutocompleteListLayout = (typeof AUTOCOMPLETE_LIST_LAYOUTS)[number]

export const CLASS_SELECTOR_TABS = ["classes", "clubs"] as const
export type ClassSelectorTab = (typeof CLASS_SELECTOR_TABS)[number]

export function classSelectorPanelId(tab: ClassSelectorTab) {
  return `class-selector-panel-${tab}`
}

export function classSelectorTabId(tab: ClassSelectorTab) {
  return `class-selector-tab-${tab}`
}

export function filterByName<T>(
  items: readonly T[],
  query: string,
  nameExtractor: (item: T) => string,
  normalize: (text: string) => string = (text) => text,
): T[] {
  const normalizedQuery = normalize(query).toLowerCase()
  return items.filter((item) =>
    normalize(nameExtractor(item)).toLowerCase().includes(normalizedQuery),
  )
}

export function ignoreDashes(text: string) {
  return text.replace(/-/g, "")
}

export function ignoreDashesAndUnderscores(text: string) {
  return text.replace(/[-_]/g, "")
}

export function tabForSearchParam(isClassInSearchParam: boolean): ClassSelectorTab {
  return isClassInSearchParam ? "classes" : "clubs"
}
