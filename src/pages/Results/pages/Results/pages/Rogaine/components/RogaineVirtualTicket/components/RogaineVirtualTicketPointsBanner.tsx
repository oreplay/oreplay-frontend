import React from "react"
import { useTranslation } from "react-i18next"
import { ProcessedRunnerResultModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketPosition from "../../../../../../../components/VirtualTicket/components/VirtualTicketPosition.tsx"
import VirtualTicketResultTime from "../../../../../../../components/VirtualTicket/components/VirtualTicketResultTime.tsx"
import VirtualTicketStat from "../../../../../../../components/VirtualTicket/components/VirtualTicketStat.tsx"
import VirtualTicketSummary from "../../../../../../../components/VirtualTicket/components/VirtualTicketSummary.tsx"
import { timeOfDayText } from "../../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"
import { STAT_SIZE } from "../../../../../../../components/VirtualTicket/shared/ticketLayout.ts"
import { bonusPenaltyText, pointsText } from "../shared/rogaineTicket.ts"

type RogaineVirtualTicketPointsBannerProps = {
  classSize: number | null
  runnerResult: ProcessedRunnerResultModel
}

/**
 * Summary of a rogaine result within a virtual ticket: position, points and time, then the start
 * and finish times of day and the bonus and penalty points.
 *
 * @param props.classSize Number of teams in the class; `null` while unknown.
 * @param props.runnerResult Result to be displayed.
 */
const RogaineVirtualTicketPointsBanner: React.FC<RogaineVirtualTicketPointsBannerProps> = ({
  classSize,
  runnerResult,
}) => {
  const { t } = useTranslation()

  return (
    <VirtualTicketSummary>
      <VirtualTicketPosition classSize={classSize} result={runnerResult} />
      <VirtualTicketStat label={t("ResultsStage.Points")} size={STAT_SIZE.Large}>
        {pointsText(runnerResult)}
      </VirtualTicketStat>
      <VirtualTicketResultTime result={runnerResult} />
      <VirtualTicketStat label={t("ResultsStage.VirtualTicket.Start")}>
        {timeOfDayText(runnerResult.start_time)}
      </VirtualTicketStat>
      <VirtualTicketStat label={t("ResultsStage.VirtualTicket.Finish")}>
        {timeOfDayText(runnerResult.finish_time)}
      </VirtualTicketStat>
      <VirtualTicketStat label={t("ResultsStage.VirtualTicket.BonusPenalty")}>
        {bonusPenaltyText(runnerResult)}
      </VirtualTicketStat>
    </VirtualTicketSummary>
  )
}

export default RogaineVirtualTicketPointsBanner
