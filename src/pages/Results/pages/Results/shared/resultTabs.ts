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

export function hasOneChildPerTab(children: readonly unknown[], options: readonly unknown[]) {
  return children.length === options.length
}

export function resultTabId(key: ResultTabKey) {
  return `result-tab-${key}`
}

export function resultTabPanelId(key: ResultTabKey) {
  return `result-tabpanel-${key}`
}
