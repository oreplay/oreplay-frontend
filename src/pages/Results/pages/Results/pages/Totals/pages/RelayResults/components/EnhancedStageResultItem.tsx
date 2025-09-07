import { Typography, Box } from "@mui/material"
import { ProcessedOverallModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  parseSecondsToMMSS,
  formatScoreAsInteger,
} from "../../../../../../../../../shared/Functions.tsx"

interface EnhancedStageResultItemProps {
  stage: ProcessedOverallModel
}

export default function EnhancedStageResultItem({ stage }: EnhancedStageResultItemProps) {
  const stageDescription = stage?.stage ? stage.stage.description : `Stage ${stage.stage_order}`

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1.5,
        borderBottom: "1px solid #e9ecef",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Box sx={{ width: "40px", textAlign: "left" }}>
        <Typography sx={{ fontSize: "0.875rem", fontWeight: 400, color: "#000000" }}>
          {stage.position}.
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Typography sx={{ fontSize: "0.875rem", fontWeight: 400, color: "#000000" }}>
          {stageDescription}
        </Typography>
      </Box>

      <Box sx={{ width: "60px", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        {stage.time_seconds && (
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 400, color: "#000000" }}>
            {parseSecondsToMMSS(stage.time_seconds)}
          </Typography>
        )}
        {stage.points_final !== null && stage.points_final !== undefined && (
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 400, color: "#000000" }}>
            {formatScoreAsInteger(stage.points_final)}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
