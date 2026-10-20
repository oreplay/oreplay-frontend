import { useTranslation } from "react-i18next"
import VirtualTicketStat from "../../../../../../../components/VirtualTicket/components/VirtualTicketStat.tsx"
import InfoTip from "../../InfoTip/InfoTip.tsx"

interface FootOVirtualTicketPointsProps {
  points: number
}

/**
 * Points a FootO runner scored, with the same info tip as the graphs that explains the 1000-point
 * formula. The explanation opens below the summary, its closest positioned ancestor.
 *
 * @param props.points Points scored.
 */
export default function FootOVirtualTicketPoints({ points }: FootOVirtualTicketPointsProps) {
  const { t } = useTranslation()

  return (
    <VirtualTicketStat label={t("ResultsStage.Points")}>
      <span className="-my-1 flex items-center gap-0.5 sm:gap-1">
        {points}
        <InfoTip
          description={t("ResultsStage.VirtualTicket.FootO.Points.HelpMsg")}
          label={t("ResultsStage.VirtualTicket.FootO.Points.HelpLabel")}
        />
      </span>
    </VirtualTicketStat>
  )
}
