import { useTranslation } from "react-i18next"
import SegmentedControl from "../../../../../../../../../components/SegmentedControl/SegmentedControl.tsx"
import {
  SEGMENTED_CONTROL_MODE,
  SegmentedControlOption,
} from "../../../../../../../../../components/SegmentedControl/shared/segmentedControl.ts"
import {
  ROGAINE_TICKET_TAB,
  RogaineTicketTab,
  rogaineTicketPanelId,
  rogaineTicketTabId,
} from "../shared/rogaineTicket.ts"
import ControlsIcon from "./icons/ControlsIcon.tsx"
import StopwatchIcon from "./icons/StopwatchIcon.tsx"

interface RogaineVirtualTicketTabsProps {
  onTabChange: (tab: RogaineTicketTab) => void
  selectedTab: RogaineTicketTab
}

const TAB_OPTIONS: readonly SegmentedControlOption<RogaineTicketTab>[] = [
  {
    icon: <ControlsIcon />,
    key: ROGAINE_TICKET_TAB.Controls,
    labelKey: "ResultsStage.VirtualTicket.Controls",
  },
  {
    icon: <StopwatchIcon />,
    key: ROGAINE_TICKET_TAB.Splits,
    labelKey: "ResultsStage.VirtualTicket.Splits",
  },
]

/**
 * Tabs of the rogaine ticket that switch between the punched controls and the splits.
 *
 * @param props.onTabChange Called with the tab the user picked.
 * @param props.selectedTab The tab whose panel is shown.
 */
export default function RogaineVirtualTicketTabs({
  onTabChange,
  selectedTab,
}: RogaineVirtualTicketTabsProps) {
  const { t } = useTranslation()

  return (
    <SegmentedControl
      ariaLabel={t("ResultsStage.VirtualTicket.TicketView")}
      mode={SEGMENTED_CONTROL_MODE.Tabs}
      onChange={onTabChange}
      options={TAB_OPTIONS}
      optionId={rogaineTicketTabId}
      panelId={rogaineTicketPanelId}
      selectedKey={selectedTab}
      className="flex-none"
    />
  )
}
