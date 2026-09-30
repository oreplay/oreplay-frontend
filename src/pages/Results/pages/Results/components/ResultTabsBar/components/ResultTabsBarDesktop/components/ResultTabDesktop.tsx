import React from "react"
import { useTranslation } from "react-i18next"
import { ResultTabOption, resultTabId, resultTabPanelId } from "../../../../../shared/resultTabs.ts"

type ResultTabDesktopProps = {
  isSelected: boolean
  onKeyDown: (event: React.KeyboardEvent) => void
  onSelect: () => void
  option: ResultTabOption
}

export default function ResultTabDesktop(props: ResultTabDesktopProps) {
  const { t } = useTranslation()
  const colorClass = props.isSelected
    ? "bg-primary/[0.06] text-primary"
    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
  const focusableIndex = props.isSelected ? 0 : -1

  return (
    <button
      type="button"
      role="tab"
      id={resultTabId(props.option.key)}
      aria-controls={resultTabPanelId(props.option.key)}
      aria-selected={props.isSelected}
      tabIndex={focusableIndex}
      onClick={props.onSelect}
      onKeyDown={props.onKeyDown}
      className={`result-tab-desktop relative flex min-w-[88px] flex-col items-center justify-center gap-0.5 px-4 pb-2 pt-2.5 text-[0.8125rem] font-medium transition-colors duration-200 focus-visible:bg-neutral-100 focus-visible:outline-none ${colorClass}`}
    >
      {props.option.icon}
      <span>{t(props.option.labelKey)}</span>
      {props.isSelected && (
        <span
          aria-hidden="true"
          className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-primary"
        />
      )}
    </button>
  )
}
