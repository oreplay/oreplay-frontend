import { Typography, Box } from "@mui/material"
import { ProcessedOverallModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { useTranslation } from "react-i18next"
import StageResultItemPointBasedColumn from "./components/StageResultItemPointBasedColumn"
import { UPLOAD_TYPES } from "../../../../../../shared/constants.ts"
import StageResultItemTimeBased from "./components/StageResultItemTimeBased"
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
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        px: 2,
        py: 1.5,
        borderBottom: "1px solid #e9ecef",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ fontSize: "small", color: "text.secondary" }}>
          {stageDescription}
        </Typography>
        {displayContributory && !stage.contributory ? <NonContributoryChip /> : <></>}
      </Box>
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
    </Box>
  )
}
