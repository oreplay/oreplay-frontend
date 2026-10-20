import { useTranslation } from "react-i18next"
import { ProcessedRunnerResultModel } from "../shared/EntityTypes.ts"
import { EMPTY_VALUE, isRankedResult } from "../shared/ticketDisplay.ts"
import { STAT_SIZE } from "../shared/ticketLayout.ts"
import VirtualTicketStat from "./VirtualTicketStat.tsx"

interface VirtualTicketPositionProps {
  classSize: number | null
  result: ProcessedRunnerResultModel
}

/**
 * Position of a result in its class, written "3 / 14". A result that is not ranked shows a dash.
 *
 * @param props.classSize Number of runners in the class; when `null` only the position is shown.
 * @param props.result The result to place.
 */
export default function VirtualTicketPosition({ classSize, result }: VirtualTicketPositionProps) {
  const { t } = useTranslation()
  const isRanked = isRankedResult(result)

  return (
    <VirtualTicketStat label={t("ResultsStage.VirtualTicket.Position")} size={STAT_SIZE.Large}>
      {isRanked ? (
        <span className="virtual-ticket-position font-bold text-neutral-900">
          {result.position}
          {classSize !== null && (
            <span className="ml-1 text-[13px] font-normal text-neutral-500">/ {classSize}</span>
          )}
        </span>
      ) : (
        <span className="virtual-ticket-position font-medium text-neutral-400">{EMPTY_VALUE}</span>
      )}
    </VirtualTicketStat>
  )
}
