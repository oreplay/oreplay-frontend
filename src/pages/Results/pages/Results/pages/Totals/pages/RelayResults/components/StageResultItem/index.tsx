import { Typography, Box } from "@mui/material"
import { ProcessedOverallModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  parseSecondsToMMSS,
  formatScoreAsInteger,
  parseTimeBehind,
} from "../../../../../../../../../../shared/Functions.tsx"
import { useTranslation } from "react-i18next"
import { RESULT_STATUS } from "../../../../../../../../shared/constants.ts"
import { parseResultStatus } from "../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import { UPLOAD_TYPES } from "../../../../../../shared/constants.ts"

interface EnhancedStageResultItemProps {
  stage: ProcessedOverallModel
  isRunnerNC?: boolean
}

export default function Index({ stage, isRunnerNC = false }: EnhancedStageResultItemProps) {
  const stageDescription = stage?.stage ? stage.stage.description : `Stage ${stage.stage_order}`
  const { t } = useTranslation()

  const statusCode = stage.status_code || "0"
  const shouldShowStatusText = statusCode !== RESULT_STATUS.ok

  const timeBehind = stage.time_behind ?? 0

  // Check for struck-through conditions:
  const isContributory = stage?.contributory !== false
  const hasZeroPoints = stage.points_final === 0
  const shouldShowStrikethrough = !isContributory || (isRunnerNC && hasZeroPoints)

  // Determine if this is a points-based or time-based stage based on upload_type
  const isPointsBased = stage.upload_type !== UPLOAD_TYPES.TOTAL_TIMES
  const isTimeBased = stage.time_seconds && stage.time_seconds > 0

  const shouldShowDashes =
    isRunnerNC || !isContributory || (isPointsBased && hasZeroPoints) || shouldShowStatusText

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
          {!isContributory || shouldShowStatusText || stage.position === 0
            ? "-"
            : `${stage.position || 0}.`}
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
        {shouldShowStatusText ? (
          // Show status text when runner status is not OK
          <>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 400,
                color: "#000000",
              }}
            >
              {t(`ResultsStage.statusCodes.${parseResultStatus(stage.status_code)}`)}
            </Typography>
            {/* Empty second line */}
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 400,
                color: "primary.main",
                visibility: "hidden",
              }}
            >
              --
            </Typography>
          </>
        ) : isTimeBased ? (
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
                  color: "primary.main",
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
            ) : (
              // Show time_behind from backend (formatted as HH:MM:SS with +/- sign)
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "primary.main",
                  textDecoration: shouldShowStrikethrough ? "line-through" : "none",
                }}
              >
                {parseTimeBehind(timeBehind)}
              </Typography>
            )}
          </>
        ) : isPointsBased ? (
          // Points only (no time)
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 400,
              color: "#000000",
              textDecoration: shouldShowStrikethrough ? "line-through" : "none",
            }}
          >
            {`${formatScoreAsInteger(stage.points_final)} ${t("Overall.pointsAbbreviation")}`}
          </Typography>
        ) : (
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
