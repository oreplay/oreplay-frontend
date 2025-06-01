import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import FlexCol from "../../../../../../../components/FlexCol.tsx"
import RacePosition from "../../../../../../../components/RacePosition..tsx"
import { runnerService } from "../../../../../../../../../domain/services/RunnerService.ts"
import { useTranslation } from "react-i18next"
import ParticipantName from "../../../../../../../components/ParticipantName.tsx"
import StageResultItem from "./StageResultItem.tsx"
import { Box, Typography } from "@mui/material"
import ResultListItem from "../../../../../../../components/ResultsList/ResultListItem.tsx"
import { RunnerModel } from "../../../../../../../../../shared/EntityTypes.ts"

export default function TotalsResultItem({
  runner,
}: {
  runner: ProcessedRunnerModel
  handleRowClick: (runner: RunnerModel) => void
}) {
  const { t } = useTranslation()

  const hasChipDownload = true
  const result = runner.overalls.overall

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ResultListItem key={runner.id}>
        <FlexCol width="10px">
          <RacePosition
            position={result.position}
            hasDownload={hasChipDownload}
            isNC={runner.is_nc}
          />
        </FlexCol>
        <ParticipantName name={runner.full_name} subtitle={runnerService.getClubName(runner, t)} />
        <FlexCol flexGrow={1}>
          <Typography>{`${result.time_seconds}_secs`}</Typography>
          <Typography>{`${result.points_final}_pts`}</Typography>
        </FlexCol>
      </ResultListItem>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {runner.overalls.parts?.map((stage) => <StageResultItem key={stage.id} stage={stage} />)}
      </Box>
    </Box>
  )
}
