import {
  VirtualTicketContainer,
  VirtualTicketProps,
} from "../../../../../../../../components/VirtualTicket/VirtualTicketContainer.tsx"
import { VirtualTicketHeader } from "../../../../../../../../components/VirtualTicket/VirtualTicketHeader.tsx"
import { VirtualTicketSplits } from "../../../../../../../../components/VirtualTicket/VirtualTicketSplits/VirtualTicketSplits.tsx"
import VirtualTicketRunnerInfo from "../../../../../../../../components/VirtualTicket/VirtualTicketRunnerInfo.tsx"
import VirtualTicketSplitsTable from "../../../../../../../../components/VirtualTicket/components/VirtualTicketSplitsTable.tsx"
import { classSize } from "../../../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"
import {
  selectRunnerList,
  useClassRunners,
} from "../../../../../../../../components/VirtualTicket/shared/useClassRunners.ts"
import RelayVirtualTicketLegBanner from "./components/RelayVirtualTicketLegBanner/RelayVirtualTicketLegBanner.tsx"
import RelayVirtualTicketTeamResult from "./components/RelayVirtualTicketTeamResult/RelayVirtualTicketTeamResult.tsx"
import GeneralErrorFallback from "../../../../../../../../../../components/GeneralErrorFallback.tsx"
import RogaineVirtualTicketSplit from "../../../../../Rogaine/components/RogaineVirtualTicket/components/RogaineVirtualTicketSplitsTab/components/RogaineVirtualTicketSplits.tsx"
import { getRelayRunnersByClass } from "../../../../services/RelayService.ts"

interface RelayVirtualTicketProps extends VirtualTicketProps {
  leg?: number
}

/**
 * This is the Virtual Ticket of one leg of a relay team: the team and its final result, then the
 * leg runner with the leg's result and the team's standing at the end of it, and the leg's splits.
 *
 * @param props.isTicketOpen Whether the ticket is shown.
 * @param props.runner The team the ticket is about; renders nothing without it.
 * @param props.handleCloseTicket Called when the user closes the ticket.
 * @param props.isClass Whether the results page lists a class rather than a club.
 * @param props.setClassClubId Changes the results page to another class or club.
 * @param props.leg Leg number shown, starting at one; renders nothing without it.
 */
export default function RelayVirtualTicket(props: RelayVirtualTicketProps) {
  const { runner, classRunners } = useClassRunners(
    props.runner,
    props.isClass ?? false,
    getRelayRunnersByClass,
    selectRunnerList,
  )

  if (!runner || !props.leg) {
    return
  }

  const legRunner = runner.runners?.at(props.leg - 1)

  if (!legRunner) {
    console.error(`Runner ${runner.full_name} doesn't have leg ${props.leg}`)
    return <GeneralErrorFallback />
  }

  return (
    <VirtualTicketContainer
      isTicketOpen={props.isTicketOpen}
      runner={runner}
      handleCloseTicket={props.handleCloseTicket}
    >
      <VirtualTicketHeader>
        <VirtualTicketRunnerInfo runner={runner} setClassClubId={props.setClassClubId} />
        <RelayVirtualTicketTeamResult classSize={classSize(classRunners)} result={runner.stage} />
        <hr className="m-0 h-px border-0 bg-[#ededed]" />
        <RelayVirtualTicketLegBanner classTeams={classRunners} runner={runner} leg={props.leg} />
      </VirtualTicketHeader>
      <VirtualTicketSplits download={true} isDNS={false}>
        <VirtualTicketSplitsTable>
          {legRunner.stage.splits.map((split) => (
            <RogaineVirtualTicketSplit key={split.id} split={split} />
          ))}
        </VirtualTicketSplitsTable>
      </VirtualTicketSplits>
    </VirtualTicketContainer>
  )
}
