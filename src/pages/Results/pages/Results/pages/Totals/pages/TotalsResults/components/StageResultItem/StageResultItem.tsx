import { ProcessedOverallModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { useTranslation } from "react-i18next"
import StageResultItemPointBasedColumn from "./components/StageResultItemPointBasedColumn/StageResultItemPointBasedColumn.tsx"
import { UPLOAD_TYPES } from "../../../../../../shared/constants.ts"
import StageResultItemTimeBased from "./components/StageResultItemTimeBased/StageResultItemTimeBased.tsx"
import NonContributoryChip from "./components/Chips/NonContributoryChip.tsx"

interface StageResultItemProps {
  stage: ProcessedOverallModel
  displayContributory?: boolean
}

export default function StageResultItem({ stage, displayContributory }: StageResultItemProps) {
  const { t } = useTranslation()
  const stageDescription = stage?.stage
    ? stage.stage.description
    : t("ResultsStage.StageNumber", { number: stage.stage_order })

  const isPointsBased = stage.upload_type !== UPLOAD_TYPES.TOTAL_TIMES

  return (
    <div className="flex items-start justify-between px-2 py-1.5">
      <div className="flex flex-row flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600">{stageDescription}</span>
        {displayContributory && !stage.contributory ? <NonContributoryChip /> : <></>}
      </div>
      {isPointsBased ? (
        <StageResultItemPointBasedColumn
          points={stage.points_final!}
          time={stage.time_seconds!}
          position={stage.position!}
          status={stage.status_code}
          contributory={stage.contributory}
        />
      ) : (
        <StageResultItemTimeBased
          time={stage.time_seconds!}
          status={stage.status_code}
          position={stage.position!}
          contributory={stage.contributory}
        />
      )}
    </div>
  )
}
