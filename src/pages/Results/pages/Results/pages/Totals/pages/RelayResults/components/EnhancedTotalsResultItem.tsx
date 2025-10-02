import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import FlexCol from "../../../../../../../components/FlexCol.tsx"
import RacePosition from "../../../../../../../components/RacePosition..tsx"
import { runnerService } from "../../../../../../../../../domain/services/RunnerService.ts"
import { useTranslation } from "react-i18next"
import ParticipantName from "../../../../../../../components/ParticipantName.tsx"
import EnhancedStageResultItem from "./EnhancedStageResultItem.tsx"
import { Box, Typography, Collapse, IconButton } from "@mui/material"
import { ExpandMore } from "@mui/icons-material"
import ResultListItem from "../../../../../../../components/ResultsList/ResultListItem.tsx"
import { RunnerModel } from "../../../../../../../../../shared/EntityTypes.ts"
import {
  parseSecondsToMMSS,
  parseTimeBehind,
  formatScoreAsInteger,
} from "../../../../../../../../../shared/Functions.tsx"
import { useState } from "react"
import { RESULT_STATUS } from "../../../../../../../shared/constants.ts"

interface EnhancedTotalsResultItemProps {
  runner: ProcessedRunnerModel
  handleRowClick: (runner: RunnerModel) => void
  isClass?: boolean // Add this prop to determine if we're in class or club view
}

export default function EnhancedTotalsResultItem({
  runner,
  isClass = true, // Default to class view
}: EnhancedTotalsResultItemProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const hasChipDownload = true
  const result = runner.overalls?.overall

  if (!result) {
    console.error("Totals results without overalls", runner)
    return <Box></Box>
  }

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const hasStageDetails = runner.overalls?.parts && runner.overalls.parts.length > 0

  const isNC = runner.is_nc || runnerService.isNC(runner)

  const statusCode = result.status_code || "0"
  const shouldShowStatusText = statusCode !== RESULT_STATUS.ok

  // Determine if this is a points-based event based on upload_type
  const isPointsBasedEvent = result.upload_type === "total_points"

  const timeBehind = result.time_behind ?? 0
  const pointsBehind = result.points_behind ?? null

  const subtitle = isClass
    ? runnerService.getClubName(runner, t)
    : runnerService.getClassName(runner)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        mb: 1,
        "&:hover": {
          backgroundColor: "#f8f9fa",
        },
      }}
    >
      <ResultListItem onClick={hasStageDetails ? handleExpandClick : undefined}>
        <FlexCol width="10px">
          <RacePosition
            position={shouldShowStatusText ? 0 : result.position}
            hasDownload={hasChipDownload}
            isNC={isNC}
          />
        </FlexCol>
        <ParticipantName name={runner.full_name} subtitle={subtitle} />
        <FlexCol flexGrow={1}>
          {shouldShowStatusText ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 0 }}
            >
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 400 }}>
                {t(`ResultsStage.statusCodes.${statusCode}`)}
              </Typography>
              {/* Empty second line where points/time difference would normally be */}
              <Typography sx={{ color: "primary.main", fontSize: 14, visibility: "hidden" }}>
                --
              </Typography>
            </Box>
          ) : isPointsBasedEvent ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 0 }}
            >
              <Typography noWrap>
                {result.points_final !== null && result.points_final !== undefined ? (
                  <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                    {formatScoreAsInteger(result.points_final)} {t("Overall.pointsAbbreviation")}
                  </Box>
                ) : (
                  "--"
                )}
              </Typography>
              <Typography sx={{ color: "primary.main", fontSize: 14, whiteSpace: "nowrap" }}>
                {isNC || result.points_final === 0
                  ? "----"
                  : pointsBehind !== null && pointsBehind !== undefined
                    ? `${pointsBehind >= 0 ? `+${pointsBehind}` : pointsBehind} pts`
                    : ""}
              </Typography>
            </Box>
          ) : (
            <>
              <Typography>
                {result.time_seconds ? parseSecondsToMMSS(result.time_seconds) : ""}
              </Typography>
              <Typography sx={{ color: "primary.main", fontSize: 14 }}>
                {isNC ? "----" : parseTimeBehind(timeBehind)}
              </Typography>
            </>
          )}
        </FlexCol>
        {hasStageDetails && (
          <FlexCol width="40px" alignItems="center">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                handleExpandClick()
              }}
              sx={{
                transition: "transform 0.2s ease-in-out",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <ExpandMore fontSize="small" />
            </IconButton>
          </FlexCol>
        )}
      </ResultListItem>

      {hasStageDetails && (
        <Collapse in={expanded} timeout={300}>
          <Box
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: "0 0 8px 8px",
              overflow: "hidden",
            }}
          >
            {runner.overalls?.parts?.map((stage) => {
              return <EnhancedStageResultItem key={stage.id} stage={stage} isRunnerNC={isNC} />
            })}
          </Box>
        </Collapse>
      )}
    </Box>
  )
}
