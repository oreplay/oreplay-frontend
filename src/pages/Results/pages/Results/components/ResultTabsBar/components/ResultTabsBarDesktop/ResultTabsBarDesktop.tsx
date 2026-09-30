import "../../../../../../../../styles/tokens.css"
import "../../../../../../../../styles/tailwind.css"
import React from "react"
import { ResultTabsBarProps, resultTabId, tabIndexForKey } from "../../../../shared/resultTabs.ts"
import ResultTabDesktop from "./components/ResultTabDesktop.tsx"

export default function ResultTabsBarDesktop(props: ResultTabsBarProps) {
  const selectTabFromKeyboard = (event: React.KeyboardEvent) => {
    const newIndex = tabIndexForKey(event.key, props.selectedMenu, props.options.length)
    if (newIndex === null) return

    event.preventDefault()
    props.onChange(newIndex)
    document.getElementById(resultTabId(props.options[newIndex].key))?.focus()
  }

  return (
    <nav className="result-tabs-bar-desktop tw-root sticky top-0 z-10 flex justify-end border-b border-neutral-200 bg-white px-4 font-sans shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div role="tablist" className="flex gap-1">
        {props.options.map((option, index) => (
          <ResultTabDesktop
            key={option.key}
            option={option}
            isSelected={index === props.selectedMenu}
            onSelect={() => props.onChange(index)}
            onKeyDown={selectTabFromKeyboard}
          />
        ))}
      </div>
    </nav>
  )
}
