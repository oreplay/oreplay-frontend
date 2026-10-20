import React from "react"
import { useTranslation } from "react-i18next"
import { ProcessedRunnerResultModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketPosition from "../../../../../../../components/VirtualTicket/components/VirtualTicketPosition.tsx"
import VirtualTicketResultTime from "../../../../../../../components/VirtualTicket/components/VirtualTicketResultTime.tsx"
import VirtualTicketStat from "../../../../../../../components/VirtualTicket/components/VirtualTicketStat.tsx"
import VirtualTicketSummary from "../../../../../../../components/VirtualTicket/components/VirtualTicketSummary.tsx"
import {
  behindText,
  isRankedResult,
  timeOfDayText,
} from "../../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"
import { STAT_SIZE } from "../../../../../../../components/VirtualTicket/shared/ticketLayout.ts"
import { hasChipDownload } from "../../../../../shared/functions.ts"
import FootOVirtualTicketPoints from "./FootOVirtualTicketPoints.tsx"

type FootOVirtualTicketTimesBannerProps = {
  classSize: number | null
  runnerResult: ProcessedRunnerResultModel
}

/**
 * Summary of a FootO result within a virtual ticket: position, time and time behind, then the
 * start and finish times of day and the points. A result that is not ranked shows its status
 * where the time and time behind would be.
 *
 * @param props.classSize Number of runners in the class; `null` while unknown.
 * @param props.runnerResult Result to be displayed.
 */
const FootOVirtualTicketTimesBanner: React.FC<FootOVirtualTicketTimesBannerProps> = ({
  classSize,
  runnerResult,
}) => {
  const { t } = useTranslation()
  const isRanked = isRankedResult(runnerResult)
  const timeSpanClass = isRanked ? "" : "col-span-2"

  return (
    <VirtualTicketSummary>
      <VirtualTicketPosition classSize={classSize} result={runnerResult} />
      <VirtualTicketResultTime result={runnerResult} className={timeSpanClass} />
      {isRanked && (
        <VirtualTicketStat
          label={t("ResultsStage.VirtualTicket.Behind")}
          size={STAT_SIZE.LargeMuted}
        >
          {behindText(runnerResult)}
        </VirtualTicketStat>
      )}
      <VirtualTicketStat label={t("ResultsStage.VirtualTicket.Start")}>
        {timeOfDayText(runnerResult.start_time)}
      </VirtualTicketStat>
      <VirtualTicketStat label={t("ResultsStage.VirtualTicket.Finish")}>
        {timeOfDayText(runnerResult.finish_time)}
      </VirtualTicketStat>
      {hasChipDownload(runnerResult) && (
        <FootOVirtualTicketPoints points={runnerResult.points_final} />
      )}
    </VirtualTicketSummary>
  )
}

export default FootOVirtualTicketTimesBanner
