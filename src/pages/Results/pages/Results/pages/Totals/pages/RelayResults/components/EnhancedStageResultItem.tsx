import { Typography, Box } from "@mui/material"
import { ProcessedOverallModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  parseSecondsToMMSS,
  formatScoreAsInteger,
  parseTimeBehind,
} from "../../../../../../../../../shared/Functions.tsx"
import { useTranslation } from "react-i18next"

interface StageLeaderData {
  stageId: string
  bestTime?: number
  bestPoints?: number
}

interface EnhancedStageResultItemProps {
  stage: ProcessedOverallModel
  stageLeader?: StageLeaderData
  isRunnerNC?: boolean // Add this prop to know if the overall runner is NC
}

export default function EnhancedStageResultItem({
  stage,
  stageLeader,
  isRunnerNC = false,
}: EnhancedStageResultItemProps) {
  const stageDescription = stage?.stage ? stage.stage.description : `Stage ${stage.stage_order}`
  const { t } = useTranslation()

  // Calculate time behind stage leader if applicable
  const timeBehindStageLeader =
    stageLeader?.bestTime && stage.time_seconds && stage.time_seconds > 0
      ? stage.time_seconds - stageLeader.bestTime
      : null

  // Check if this runner was the stage leader (position 1 in this stage)
  const isStageLeader = stage.position === 1

  // Check for struck-through conditions:
  // 1. contributory === false (from backend data)
  // 2. points_final === 0 for NC stages in points-based events
  // 3. Overall runner is NC (isRunnerNC prop)

  // Get contributory status from the stage data if available
  // Note: This assumes the backend provides a contributory field in the stage data
  // If not available, we fall back to checking points_final === 0
  const isContributory = (stage as any).contributory !== false // Default to true if not specified
  const hasZeroPoints = stage.points_final === 0
  const shouldShowStrikethrough = !isContributory || (isRunnerNC && hasZeroPoints)

  // Determine if this is a points-based or time-based stage
  const isPointsBased =
    stage.points_final !== null && stage.points_final !== undefined && stage.points_final > 0
  const isTimeBased = stage.time_seconds && stage.time_seconds > 0

  // Check if this stage should show "----" for differences
  // Show "----" if: runner is NC, or contributory is false, or points are 0 in points-based events
  const shouldShowDashes = isRunnerNC || !isContributory || (isPointsBased && hasZeroPoints)

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
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 400,
            color: "#000000",
            textDecoration: shouldShowStrikethrough ? "line-through" : "none",
          }}
        >
          {stage.position || 0}.
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 400,
            color: "#000000",
            textDecoration: shouldShowStrikethrough ? "line-through" : "none",
          }}
        >
          {stageDescription}
        </Typography>
      </Box>

      <Box sx={{ width: "60px", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        {isTimeBased && (
          <>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 400,
                color: "#000000",
                textDecoration: shouldShowStrikethrough ? "line-through" : "none",
              }}
            >
              {parseSecondsToMMSS(stage.time_seconds!)}
            </Typography>
            {isPointsBased ? (
              // Points-based stage: show points below time
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "#000000",
                  textDecoration: shouldShowStrikethrough ? "line-through" : "none",
                }}
              >
                {shouldShowDashes
                  ? "----"
                  : `${formatScoreAsInteger(stage.points_final)} ${t("Overall.pointsAbbreviation")}`}
              </Typography>
            ) : shouldShowDashes ? (
              // Show "----" for NC or non-contributory stages
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "primary.main",
                  textDecoration: shouldShowStrikethrough ? "line-through" : "none",
                }}
              >
                ----
              </Typography>
            ) : isStageLeader ? (
              // Stage leader: show +00:00
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "primary.main",
                  textDecoration: shouldShowStrikethrough ? "line-through" : "none",
                }}
              >
                +00:00
              </Typography>
            ) : timeBehindStageLeader !== null && stageLeader?.bestTime ? (
              // Not stage leader: show time difference
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "primary.main",
                  textDecoration: shouldShowStrikethrough ? "line-through" : "none",
                }}
              >
                {parseTimeBehind(timeBehindStageLeader)}
              </Typography>
            ) : null}
          </>
        )}
        {!isTimeBased && isPointsBased && (
          // Points only (no time)
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 400,
              color: "#000000",
              textDecoration: shouldShowStrikethrough ? "line-through" : "none",
            }}
          >
            {shouldShowDashes
              ? "----"
              : `${formatScoreAsInteger(stage.points_final)} ${t("Overall.pointsAbbreviation")}`}
          </Typography>
        )}
        {!isTimeBased && !isPointsBased && (
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 400,
              color: "#999999",
              textDecoration: shouldShowStrikethrough ? "line-through" : "none",
            }}
          >
            ----
          </Typography>
        )}
      </Box>
    </Box>
  )
}
