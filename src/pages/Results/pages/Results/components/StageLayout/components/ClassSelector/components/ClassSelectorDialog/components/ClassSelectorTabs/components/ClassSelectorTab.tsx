import React from "react"
import { useTranslation } from "react-i18next"
import {
  ClassSelectorTab as ClassSelectorTabKey,
  classSelectorPanelId,
  classSelectorTabId,
} from "../../../../../shared/classSelector.ts"

interface ClassSelectorTabProps {
  icon: React.ReactElement
  isSelected: boolean
  labelKey: string
  onKeyDown: (event: React.KeyboardEvent) => void
  onSelect: () => void
  tab: ClassSelectorTabKey
}

export default function ClassSelectorTab(props: ClassSelectorTabProps) {
  const { t } = useTranslation()
  const colorClass = props.isSelected
    ? "bg-white text-primary shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
    : "text-neutral-500 hover:text-neutral-800"
  const focusableIndex = props.isSelected ? 0 : -1

  return (
    <button
      type="button"
      role="tab"
      id={classSelectorTabId(props.tab)}
      aria-controls={classSelectorPanelId(props.tab)}
      aria-selected={props.isSelected}
      tabIndex={focusableIndex}
      onClick={props.onSelect}
      onKeyDown={props.onKeyDown}
      className={`class-selector-tab flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${colorClass}`}
    >
      {props.icon}
      <span>{t(props.labelKey)}</span>
    </button>
  )
}
