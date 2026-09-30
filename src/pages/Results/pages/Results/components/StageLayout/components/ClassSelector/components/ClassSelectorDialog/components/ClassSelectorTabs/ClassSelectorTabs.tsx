import React from "react"
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined"
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined"
import { tabIndexForKey } from "../../../../../../../../shared/resultTabs.ts"
import {
  CLASS_SELECTOR_TABS,
  ClassSelectorTab as ClassSelectorTabKey,
  classSelectorTabId,
} from "../../../../shared/classSelector.ts"
import ClassSelectorTab from "./components/ClassSelectorTab.tsx"

interface ClassSelectorTabsProps {
  currentTab: ClassSelectorTabKey
  onTabChange: (tab: ClassSelectorTabKey) => void
}

const TAB_ICONS: Record<ClassSelectorTabKey, React.ReactElement> = {
  classes: <LeaderboardOutlinedIcon fontSize="small" />,
  clubs: <GroupsOutlinedIcon fontSize="small" />,
}

const TAB_LABEL_KEYS: Record<ClassSelectorTabKey, string> = {
  classes: "ResultsStage.Classes",
  clubs: "ResultsStage.Clubs",
}

export default function ClassSelectorTabs(props: ClassSelectorTabsProps) {
  const selectTabFromKeyboard = (event: React.KeyboardEvent) => {
    const currentIndex = CLASS_SELECTOR_TABS.indexOf(props.currentTab)
    const newIndex = tabIndexForKey(event.key, currentIndex, CLASS_SELECTOR_TABS.length)
    if (newIndex === null) return

    event.preventDefault()
    const newTab = CLASS_SELECTOR_TABS[newIndex]
    props.onTabChange(newTab)
    document.getElementById(classSelectorTabId(newTab))?.focus()
  }

  return (
    <div
      role="tablist"
      className="class-selector-tabs flex flex-1 gap-1 rounded-lg bg-neutral-100 p-1"
    >
      {CLASS_SELECTOR_TABS.map((tab) => (
        <ClassSelectorTab
          key={tab}
          tab={tab}
          icon={TAB_ICONS[tab]}
          labelKey={TAB_LABEL_KEYS[tab]}
          isSelected={tab === props.currentTab}
          onSelect={() => props.onTabChange(tab)}
          onKeyDown={selectTabFromKeyboard}
        />
      ))}
    </div>
  )
}
