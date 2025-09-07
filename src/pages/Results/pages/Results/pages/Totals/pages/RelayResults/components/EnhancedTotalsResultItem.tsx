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
import { parseSecondsToMMSS } from "../../../../../../../../../shared/Functions.tsx"
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
}

export default function EnhancedTotalsResultItem({
  runner,
  stageLeaders,
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
          <Typography sx={{}}>
            {result.time_seconds ? parseSecondsToMMSS(result.time_seconds) : ""}
          </Typography>
          <Typography sx={{}}>{result.points_final}</Typography>
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
            {runner.overalls?.parts?.map((stage) => (
              <EnhancedStageResultItem
                key={stage.id}
                stage={stage}
                stageLeader={stageLeaders.find((leader) => leader.stageId === stage.id)}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  )
}
