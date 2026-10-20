import { useTranslation } from "react-i18next"
import { ProcessedRunnerModel } from "../../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketResultTime from "../../../../../../../../../../components/VirtualTicket/components/VirtualTicketResultTime.tsx"
import VirtualTicketStat from "../../../../../../../../../../components/VirtualTicket/components/VirtualTicketStat.tsx"
import VirtualTicketSummary from "../../../../../../../../../../components/VirtualTicket/components/VirtualTicketSummary.tsx"
import { timeOfDayText } from "../../../../../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"
import { STAT_SIZE } from "../../../../../../../../../../components/VirtualTicket/shared/ticketLayout.ts"
import GeneralErrorFallback from "../../../../../../../../../../../../components/GeneralErrorFallback.tsx"
import { legBehindText, legTeamTimeText } from "../../shared/relayLegStanding.ts"

interface RelayVirtualTicketLegBannerProps {
  classTeams: ProcessedRunnerModel[] | null
  runner: ProcessedRunnerModel
  leg: number
}

/**
 * Result of one leg within a relay team's virtual ticket: the leg runner, the leg time, and the
 * team's time and time behind at the end of that leg, then the leg's start and finish times.
 *
 * @param props.classTeams Every team of the class, to measure the gap at that leg; `null` while
 * unknown.
 * @param props.runner The team.
 * @param props.leg Leg number, starting at one.
 */
export default function RelayVirtualTicketLegBanner({
  classTeams,
  runner,
  leg,
}: RelayVirtualTicketLegBannerProps) {
  const { t } = useTranslation()
  const legRunner = runner.runners?.at(leg - 1)

  if (!legRunner) {
    return <GeneralErrorFallback />
  }

  return (
    <section className="relay-virtual-ticket-leg-banner flex flex-col gap-3">
      <h3 className="m-0 text-[13px] font-medium text-neutral-900">
        {t("ResultsStage.VirtualTicket.Leg", {
          leg,
          name: legRunner.full_name,
          interpolation: { escapeValue: false },
        })}
      </h3>
      <VirtualTicketSummary>
        <VirtualTicketResultTime
          result={legRunner.stage}
          label={t("ResultsStage.VirtualTicket.LegTime")}
        />
        <VirtualTicketStat label={t("ResultsStage.VirtualTicket.TeamTime")} size={STAT_SIZE.Large}>
          {legTeamTimeText(runner, leg)}
        </VirtualTicketStat>
        <VirtualTicketStat
          label={t("ResultsStage.VirtualTicket.Behind")}
          size={STAT_SIZE.LargeMuted}
        >
          {legBehindText(runner, classTeams, leg)}
        </VirtualTicketStat>
        <VirtualTicketStat label={t("ResultsStage.VirtualTicket.Start")} size={STAT_SIZE.Detail}>
          {timeOfDayText(legRunner.stage.start_time)}
        </VirtualTicketStat>
        <VirtualTicketStat label={t("ResultsStage.VirtualTicket.Finish")} size={STAT_SIZE.Detail}>
          {timeOfDayText(legRunner.stage.finish_time)}
        </VirtualTicketStat>
      </VirtualTicketSummary>
    </section>
  )
}
