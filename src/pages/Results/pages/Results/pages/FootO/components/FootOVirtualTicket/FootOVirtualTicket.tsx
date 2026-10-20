import {
  VirtualTicketContainer,
  VirtualTicketProps,
} from "../../../../../../components/VirtualTicket/VirtualTicketContainer.tsx"
import { VirtualTicketHeader } from "../../../../../../components/VirtualTicket/VirtualTicketHeader.tsx"
import { VirtualTicketSplits } from "../../../../../../components/VirtualTicket/VirtualTicketSplits/VirtualTicketSplits.tsx"
import VirtualTicketRunnerInfo from "../../../../../../components/VirtualTicket/VirtualTicketRunnerInfo.tsx"
import VirtualTicketSplitsTable from "../../../../../../components/VirtualTicket/components/VirtualTicketSplitsTable.tsx"
import {
  selectRunnerList,
  useClassRunners,
} from "../../../../../../components/VirtualTicket/shared/useClassRunners.ts"
import { classSize } from "../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"
import FootOVirtualTicketTimesBanner from "./components/FootOVirtualTicketTimesBanner.tsx"
import FootOVirtualTicketSplitRows from "./components/FootOVirtualTicketSplitRows.tsx"
import { hasChipDownload } from "../../../../shared/functions.ts"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"
import { getFootORunnersByClass } from "../../services/FootOService.ts"

/**
 * This is the Virtual Ticket for Foot-O results: the runner, a summary of the result and the
 * splits. In club view it loads the runner's class to get the class-wide splits and class size.
 *
 * @param props.isTicketOpen Whether the ticket is shown.
 * @param props.runner Runner the ticket is about; `null` renders nothing.
 * @param props.handleCloseTicket Called when the user closes the ticket.
 * @param props.isClass Whether the results page lists a class rather than a club.
 * @param props.setClassClubId Changes the results page to another class or club.
 */
export default function FootOVirtualTicket({
  isTicketOpen,
  runner,
  handleCloseTicket,
  isClass = false,
  setClassClubId,
}: VirtualTicketProps) {
  const {
    runner: displayedRunner,
    classRunners,
    isLoading,
    isError,
  } = useClassRunners(runner, isClass, getFootORunnersByClass, selectRunnerList)

  if (!displayedRunner) return null

  return (
    <VirtualTicketContainer
      isTicketOpen={isTicketOpen}
      runner={displayedRunner}
      handleCloseTicket={handleCloseTicket}
    >
      <VirtualTicketHeader>
        <VirtualTicketRunnerInfo runner={displayedRunner} setClassClubId={setClassClubId} />
        <FootOVirtualTicketTimesBanner
          classSize={classSize(classRunners)}
          runnerResult={displayedRunner.stage}
        />
      </VirtualTicketHeader>
      <VirtualTicketSplits
        download={hasChipDownload(displayedRunner)}
        isDNS={runnerService.isDNS(displayedRunner)}
      >
        <VirtualTicketSplitsTable>
          <FootOVirtualTicketSplitRows
            isError={isError}
            isLoading={isLoading}
            splits={displayedRunner.stage.splits}
          />
        </VirtualTicketSplitsTable>
      </VirtualTicketSplits>
    </VirtualTicketContainer>
  )
}
