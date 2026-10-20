import {
  VirtualTicketContainer,
  VirtualTicketProps,
} from "../../../../../../components/VirtualTicket/VirtualTicketContainer.tsx"
import OneManRelayVirtualTicketSplit from "./components/OneManRelayVirtualTicketSplit/OneManRelayVirtualTicketSplit.tsx"
import { VirtualTicketHeader } from "../../../../../../components/VirtualTicket/VirtualTicketHeader.tsx"
import VirtualTicketRunnerInfo from "../../../../../../components/VirtualTicket/VirtualTicketRunnerInfo.tsx"
import { VirtualTicketSplits } from "../../../../../../components/VirtualTicket/VirtualTicketSplits/VirtualTicketSplits.tsx"
import VirtualTicketSplitsTable from "../../../../../../components/VirtualTicket/components/VirtualTicketSplitsTable.tsx"
import { classSize } from "../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"
import {
  selectRunnerList,
  useClassRunners,
} from "../../../../../../components/VirtualTicket/shared/useClassRunners.ts"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"
import { hasChipDownload } from "../../../../shared/functions.ts"
import FootOVirtualTicketTimesBanner from "../../../FootO/components/FootOVirtualTicket/components/FootOVirtualTicketTimesBanner.tsx"
import { getOneManRelayRunnersByClass } from "../../services/OneManRelayService.ts"

/**
 * This is the Virtual Ticket for one-man relay results: the runner, a summary of the result and
 * the splits with times only.
 *
 * @param props.isTicketOpen Whether the ticket is shown.
 * @param props.runner Runner the ticket is about; `null` renders nothing.
 * @param props.handleCloseTicket Called when the user closes the ticket.
 * @param props.isClass Whether the results page lists a class rather than a club.
 * @param props.setClassClubId Changes the results page to another class or club.
 */
export default function OneManRelayVirtualTicket({
  isTicketOpen,
  runner,
  handleCloseTicket,
  isClass = false,
  setClassClubId,
}: VirtualTicketProps) {
  const { runner: displayedRunner, classRunners } = useClassRunners(
    runner,
    isClass,
    getOneManRelayRunnersByClass,
    selectRunnerList,
  )

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
          {displayedRunner.stage.splits.map((split) => (
            <OneManRelayVirtualTicketSplit key={split.id} split={split} />
          ))}
        </VirtualTicketSplitsTable>
      </VirtualTicketSplits>
    </VirtualTicketContainer>
  )
}
