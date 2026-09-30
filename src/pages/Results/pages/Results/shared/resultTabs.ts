import { ReactElement } from "react"
import { ResultTabKey } from "./constants.ts"

export type ResultTabOption = {
  icon: ReactElement
  key: ResultTabKey
  labelKey: string
}

export type ResultTabsBarProps = {
  onChange: (newMenu: number) => void
  options: readonly ResultTabOption[]
  selectedMenu: number
}

const FIRST_TAB_KEY = "Home"
const LAST_TAB_KEY = "End"
const NEXT_TAB_KEY = "ArrowRight"
const PREVIOUS_TAB_KEY = "ArrowLeft"

export function hasOneChildPerTab(children: readonly unknown[], options: readonly unknown[]) {
  return children.length === options.length
}

export function resultTabId(key: ResultTabKey) {
  return `result-tab-${key}`
}

export function resultTabPanelId(key: ResultTabKey) {
  return `result-tabpanel-${key}`
}

export function tabIndexForKey(pressedKey: string, currentIndex: number, total: number) {
  switch (pressedKey) {
    case NEXT_TAB_KEY:
      return (currentIndex + 1) % total
    case PREVIOUS_TAB_KEY:
      return (currentIndex - 1 + total) % total
    case FIRST_TAB_KEY:
      return 0
    case LAST_TAB_KEY:
      return total - 1
    default:
      return null
  }
}
