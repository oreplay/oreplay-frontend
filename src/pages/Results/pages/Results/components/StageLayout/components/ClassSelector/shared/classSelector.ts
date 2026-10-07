export const AUTOCOMPLETE_LIST_LAYOUTS = ["list", "wrap"] as const
export type AutocompleteListLayout = (typeof AUTOCOMPLETE_LIST_LAYOUTS)[number]

export const CLASS_SELECTOR_LABEL_KEYS = {
  classes: "ResultsStage.Class",
  clubs: "ResultsStage.Club",
} as const

export const CLASS_SELECTOR_TABS = ["classes", "clubs"] as const
export type ClassSelectorTab = (typeof CLASS_SELECTOR_TABS)[number]

export type ClassSelectorTriggerProps = {
  activeName?: string
  isClass: boolean
  onClick: () => void
}

export function classSelectorLabelKey(isClass: boolean) {
  return CLASS_SELECTOR_LABEL_KEYS[tabForKind(isClass)]
}

export function classSelectorPanelId(tab: ClassSelectorTab) {
  return `class-selector-panel-${tab}`
}

export function classSelectorTabId(tab: ClassSelectorTab) {
  return `class-selector-tab-${tab}`
}

export function classSelectorTriggerText(activeName: string | undefined, label: string) {
  return activeName || label
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

export function tabForKind(isClass: boolean): ClassSelectorTab {
  return isClass ? "classes" : "clubs"
}
