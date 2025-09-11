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

interface StageLeaderData {
  stageId: string
  bestTime?: number
  bestPoints?: number
}

interface EnhancedTotalsResultItemProps {
  runner: ProcessedRunnerModel
  handleRowClick: (runner: RunnerModel) => void
  stageLeaders: StageLeaderData[]
  overallLeaderTime?: number
  overallLeaderPoints?: number
  isPointsBasedEvent?: boolean
}

export default function EnhancedTotalsResultItem({
  runner,
  stageLeaders,
  overallLeaderTime,
  overallLeaderPoints,
  isPointsBasedEvent,
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

  // Calculate time behind overall leader
  const timeBehindOverallLeader =
    overallLeaderTime && result.time_seconds ? result.time_seconds - overallLeaderTime : 0

  // Calculate points behind overall leader
  const pointsBehindOverallLeader =
    overallLeaderPoints && result.points_final !== null && result.points_final !== undefined
      ? result.points_final - overallLeaderPoints
      : 0

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
            position={result.position}
            hasDownload={hasChipDownload}
            isNC={runner.is_nc}
          />
        </FlexCol>
        <ParticipantName name={runner.full_name} subtitle={runnerService.getClubName(runner, t)} />
        <FlexCol flexGrow={1}>
          {isPointsBasedEvent ? (
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
                {result.points_final !== null &&
                result.points_final !== undefined &&
                overallLeaderPoints
                  ? `${pointsBehindOverallLeader >= 0 ? `+${pointsBehindOverallLeader}` : pointsBehindOverallLeader} pts`
                  : ""}
              </Typography>
            </Box>
          ) : (
            <>
              <Typography>
                {result.time_seconds ? parseSecondsToMMSS(result.time_seconds) : ""}
              </Typography>
              <Typography sx={{ color: "primary.main", fontSize: 14 }}>
                {result.time_seconds && overallLeaderTime
                  ? parseTimeBehind(timeBehindOverallLeader)
                  : ""}
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
              const stageKey = stage.stage_order ? `stage_${stage.stage_order}` : stage.id
              return (
                <EnhancedStageResultItem
                  key={stage.id}
                  stage={stage}
                  stageLeader={stageLeaders.find((leader) => leader.stageId === stageKey)}
                />
              )
            })}
          </Box>
        </Collapse>
      )}
    </Box>
  )
}
