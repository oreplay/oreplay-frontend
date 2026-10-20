import { useTranslation } from "react-i18next"
import RaceTime from "../../../pages/Results/components/RaceTime.tsx"
import { hasChipDownload } from "../../../pages/Results/shared/functions.ts"
import { ProcessedRunnerResultModel } from "../shared/EntityTypes.ts"
import {
  isRankedResult,
  isTimeInvalidated,
  resultStatus,
  unrankedTimeText,
} from "../shared/ticketDisplay.ts"
import { STAT_SIZE, TYPOGRAPHY_INHERIT } from "../shared/ticketLayout.ts"
import VirtualTicketStat from "./VirtualTicketStat.tsx"
import VirtualTicketStatusChip from "./VirtualTicketStatusChip.tsx"

interface VirtualTicketResultTimeProps {
  result: ProcessedRunnerResultModel
  label?: string
  className?: string
}

/**
 * Race time of a result. A ranked result shows its time, live while the runner is still out. Any
 * other status shows its chip next to the time run, struck through when the status voided it.
 *
 * @param props.result The runner's result.
 * @param props.label Already translated name of the figure; "Time" when left out.
 * @param props.className Extra classes for the cell, such as a column span.
 */
export default function VirtualTicketResultTime({
  result,
  label,
  className,
}: VirtualTicketResultTimeProps) {
  const { t } = useTranslation()
  const status = resultStatus(result)
  const isRanked = isRankedResult(result)
  const unrankedTime = unrankedTimeText(result)
  const unrankedTimeClass = isTimeInvalidated(status)
    ? "text-neutral-500 line-through decoration-[1.5px]"
    : "text-neutral-900"
  const timeLabel = label ?? t("ResultsStage.VirtualTicket.Time")

  return (
    <VirtualTicketStat label={timeLabel} size={STAT_SIZE.Large} className={className}>
      {isRanked ? (
        <RaceTime
          style={TYPOGRAPHY_INHERIT}
          isFinalTime={hasChipDownload(result)}
          status={status}
          start_time={result.start_time}
          finish_time={result.finish_time}
          time_seconds={result.time_seconds}
        />
      ) : (
        <>
          {unrankedTime && <span className={unrankedTimeClass}>{unrankedTime}</span>}
          <VirtualTicketStatusChip status={status} />
        </>
      )}
    </VirtualTicketStat>
  )
}
