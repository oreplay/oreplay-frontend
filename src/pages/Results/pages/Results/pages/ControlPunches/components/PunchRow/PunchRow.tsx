import { useTranslation } from "react-i18next"
import ParticipantName from "../../../../components/ParticipantName.tsx"
import ResultListItem from "../../../../components/ResultsList/ResultListItem.tsx"
import ResultListItemColumn from "../../../../components/ResultsList/ResultListItemColumn.tsx"
import { getPunchSubtitle } from "../../shared/punchDisplay.ts"
import { PunchRow as PunchRowModel } from "../../shared/punchRows.ts"
import PunchClockTime from "./components/PunchClockTime.tsx"
import PunchElapsedTime from "./components/PunchElapsedTime.tsx"
import PunchTeamMember from "./components/PunchTeamMember.tsx"

interface PunchRowProps {
  row: PunchRowModel
}

/**
 * One punch at the control, laid out like a results row: the punch time where the position goes,
 * the participant with class and club, and the time since the start on the right. A relay leg shows
 * its team with the runner who punched below.
 * @param props.row The punch to show.
 */
export default function PunchRow({ row }: PunchRowProps) {
  const { t } = useTranslation()
  const subtitle = getPunchSubtitle(row.participant, t("ResultsStage.NoClubMsg"))

  return (
    <ResultListItem>
      <ResultListItemColumn slotProps={{ className: "flex h-full grow flex-row items-start" }}>
        <PunchClockTime readingTime={row.readingTime} />
        <div className="min-w-0 grow">
          <ParticipantName name={row.participant.full_name} subtitle={subtitle} />
          {row.teamMemberName && <PunchTeamMember name={row.teamMemberName} />}
        </div>
      </ResultListItemColumn>
      <ResultListItemColumn>
        <PunchElapsedTime elapsedSeconds={row.elapsedSeconds} />
      </ResultListItemColumn>
    </ResultListItem>
  )
}
