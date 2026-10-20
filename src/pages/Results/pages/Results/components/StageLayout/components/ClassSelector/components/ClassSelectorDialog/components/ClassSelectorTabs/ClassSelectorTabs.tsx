import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined"
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined"
import { useTranslation } from "react-i18next"
import SegmentedControl from "../../../../../../../../../../../../components/SegmentedControl/SegmentedControl.tsx"
import {
  SEGMENTED_CONTROL_MODE,
  SegmentedControlOption,
} from "../../../../../../../../../../../../components/SegmentedControl/shared/segmentedControl.ts"
import {
  CLASS_SELECTOR_TABS,
  ClassSelectorTab,
  classSelectorPanelId,
  classSelectorTabId,
} from "../../../../shared/classSelector.ts"

interface ClassSelectorTabsProps {
  currentTab: ClassSelectorTab
  onTabChange: (tab: ClassSelectorTab) => void
}

const TAB_OPTIONS: Record<ClassSelectorTab, SegmentedControlOption<ClassSelectorTab>> = {
  classes: {
    icon: <LeaderboardOutlinedIcon fontSize="small" />,
    key: "classes",
    labelKey: "ResultsStage.Classes",
  },
  clubs: {
    icon: <GroupsOutlinedIcon fontSize="small" />,
    key: "clubs",
    labelKey: "ResultsStage.Clubs",
  },
}

const OPTIONS = CLASS_SELECTOR_TABS.map((tab) => TAB_OPTIONS[tab])

/**
 * Tabs of the class selector dialog that switch between the list of classes and the list of clubs.
 *
 * @param props.currentTab The tab whose list is shown.
 * @param props.onTabChange Called with the tab the user picked.
 */
export default function ClassSelectorTabs({ currentTab, onTabChange }: ClassSelectorTabsProps) {
  const { t } = useTranslation()
  const groupLabel = `${t("ResultsStage.Classes")} / ${t("ResultsStage.Clubs")}`

  return (
    <SegmentedControl
      ariaLabel={groupLabel}
      mode={SEGMENTED_CONTROL_MODE.Tabs}
      onChange={onTabChange}
      options={OPTIONS}
      optionId={classSelectorTabId}
      panelId={classSelectorPanelId}
      selectedKey={currentTab}
    />
  )
}
