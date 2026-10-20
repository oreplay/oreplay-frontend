import { useTranslation } from "react-i18next"
import { ProcessedRunnerResultModel } from "../../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketPosition from "../../../../../../../../../../components/VirtualTicket/components/VirtualTicketPosition.tsx"
import VirtualTicketResultTime from "../../../../../../../../../../components/VirtualTicket/components/VirtualTicketResultTime.tsx"
import VirtualTicketStat from "../../../../../../../../../../components/VirtualTicket/components/VirtualTicketStat.tsx"
import VirtualTicketSummary from "../../../../../../../../../../components/VirtualTicket/components/VirtualTicketSummary.tsx"
import {
  behindText,
  isRankedResult,
} from "../../../../../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"
import { STAT_SIZE } from "../../../../../../../../../../components/VirtualTicket/shared/ticketLayout.ts"

interface RelayVirtualTicketTeamResultProps {
  classSize: number | null
  result: ProcessedRunnerResultModel
}

/**
 * Final result of a relay team within its virtual ticket: position, time and time behind.
 *
 * @param props.classSize Number of teams in the class; `null` while unknown.
 * @param props.result The team's result.
 */
export default function RelayVirtualTicketTeamResult({
  classSize,
  result,
}: RelayVirtualTicketTeamResultProps) {
  const { t } = useTranslation()
  const isRanked = isRankedResult(result)
  const timeSpanClass = isRanked ? "" : "col-span-2"

  return (
    <section className="relay-virtual-ticket-team-result flex flex-col gap-3">
      <h3 className="m-0 text-[13px] font-medium text-neutral-500">
        {t("ResultsStage.VirtualTicket.Team")}
      </h3>
      <VirtualTicketSummary>
        <VirtualTicketPosition classSize={classSize} result={result} />
        <VirtualTicketResultTime result={result} className={timeSpanClass} />
        {isRanked && (
          <VirtualTicketStat
            label={t("ResultsStage.VirtualTicket.Behind")}
            size={STAT_SIZE.LargeMuted}
          >
            {behindText(result)}
          </VirtualTicketStat>
        )}
      </VirtualTicketSummary>
    </section>
  )
}
