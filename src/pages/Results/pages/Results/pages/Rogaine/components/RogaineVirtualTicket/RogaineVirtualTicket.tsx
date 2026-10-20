import {
  VirtualTicketContainer,
  VirtualTicketProps,
} from "../../../../../../components/VirtualTicket/VirtualTicketContainer.tsx"
import { VirtualTicketHeader } from "../../../../../../components/VirtualTicket/VirtualTicketHeader.tsx"
import { VirtualTicketSplits } from "../../../../../../components/VirtualTicket/VirtualTicketSplits/VirtualTicketSplits.tsx"
import VirtualTicketRunnerInfo from "../../../../../../components/VirtualTicket/VirtualTicketRunnerInfo.tsx"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { classSize } from "../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"
import { useClassRunners } from "../../../../../../components/VirtualTicket/shared/useClassRunners.ts"
import RogaineVirtualTicketPointsBanner from "./components/RogaineVirtualTicketPointsBanner.tsx"
import { hasChipDownload } from "../../../../shared/functions.ts"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"
import { useState } from "react"
import RogaineVirtualTicketSplitsTab from "./components/RogaineVirtualTicketSplitsTab/RogaineVirtualTicketSplitsTab.tsx"
import RogaineVirtualTicketPointsTab from "./components/RogaineVirtualTicketPointsTab/RogaineVirtualTicketPointsTab.tsx"
import RogaineVirtualTicketTabs from "./components/RogaineVirtualTicketTabs.tsx"
import {
  ROGAINE_TICKET_TAB,
  RogaineTicketTab,
  rogaineTicketPanelId,
  rogaineTicketTabId,
} from "./shared/rogaineTicket.ts"
import { getRoganineRunnersByClass } from "../../services/RogaineService.ts"

interface RogaineVirtualTicketProps extends VirtualTicketProps {
  controls: bigint[] | null
}

/**
 * Picks the runner list out of the rogaine class request, which also resolves to the controls.
 *
 * @param data Runners and controls of the class.
 * @returns The runners.
 */
function selectRogaineRunners(data: [ProcessedRunnerModel[], bigint[]]) {
  return data[0]
}

/**
 * This is the Virtual Ticket for Score results: the team and its members, a summary of the result,
 * and tabs that show either the controls it punched or its splits.
 *
 * @param props.isTicketOpen Whether the ticket is shown.
 * @param props.runner The team the ticket is about; `null` renders nothing.
 * @param props.handleCloseTicket Called when the user closes the ticket.
 * @param props.isClass Whether the results page lists a class rather than a club.
 * @param props.setClassClubId Changes the results page to another class or club.
 * @param props.controls Codes of every control of the course.
 */
export default function RogaineVirtualTicket({
  isTicketOpen,
  runner,
  handleCloseTicket,
  isClass = false,
  setClassClubId,
  controls,
}: RogaineVirtualTicketProps) {
  const [openTab, setOpenTab] = useState<RogaineTicketTab>(ROGAINE_TICKET_TAB.Controls)
  const { runner: displayedRunner, classRunners } = useClassRunners(
    runner,
    isClass,
    getRoganineRunnersByClass,
    selectRogaineRunners,
  )

  if (!displayedRunner) return null

  const isControlsTab = openTab === ROGAINE_TICKET_TAB.Controls

  return (
    <VirtualTicketContainer
      isTicketOpen={isTicketOpen}
      runner={displayedRunner}
      handleCloseTicket={handleCloseTicket}
    >
      <VirtualTicketHeader>
        <VirtualTicketRunnerInfo
          runner={displayedRunner}
          setClassClubId={setClassClubId}
          displayTeamMemberNames
          showIcons
        />
        <RogaineVirtualTicketPointsBanner
          classSize={classSize(classRunners)}
          runnerResult={displayedRunner.stage}
        />
      </VirtualTicketHeader>
      <VirtualTicketSplits
        download={hasChipDownload(displayedRunner)}
        isDNS={runnerService.isDNS(displayedRunner)}
      >
        <RogaineVirtualTicketTabs selectedTab={openTab} onTabChange={setOpenTab} />
        <div
          role="tabpanel"
          id={rogaineTicketPanelId(openTab)}
          aria-labelledby={rogaineTicketTabId(openTab)}
        >
          {isControlsTab ? (
            <RogaineVirtualTicketPointsTab
              controls={controls}
              splits={displayedRunner.stage.splits}
            />
          ) : (
            <RogaineVirtualTicketSplitsTab splitList={displayedRunner.stage.splits} />
          )}
        </div>
      </VirtualTicketSplits>
    </VirtualTicketContainer>
  )
}
