import { ResultItemProps } from "../shared/types.ts"
import ResultListItemColumn from "../ResultListItemColumn.tsx"
import RacePosition from "../../RacePosition..tsx"
import { hasChipDownload as hasChipDownloadFunction } from "../../../shared/functions.ts"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import { Box, Typography } from "@mui/material"
import ParticipantName from "../../ParticipantName.tsx"
import ResultListItem from "../ResultListItem.tsx"

export default function TeamResult({ runner, onClick, ResultColumn }: ResultItemProps) {
  return (
    <ResultListItem key={runner.id} onClick={onClick ? () => onClick(runner) : undefined}>
      <ResultListItemColumn
        slotProps={{
          box: {
            alignItems: "flex-start",
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            height: "100%",
          },
        }}
      >
        <RacePosition
          position={runner.overalls ? runner.overalls.overall.position : runner.stage.position}
          hasDownload={runner.overalls ? true : hasChipDownloadFunction(runner)}
          isNC={runnerService.isNC(runner)}
          slotProps={{ text: { marginRight: 1 } }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <ParticipantName name={runner.full_name} />
          {runner.runners?.map((teamMember) => (
            <Typography key={teamMember.id} variant="body2" color="textSecondary">
              {teamMember.full_name}
            </Typography>
          ))}
        </Box>
      </ResultListItemColumn>
      <ResultListItemColumn>
        <ResultColumn runner={runner} />
      </ResultListItemColumn>
    </ResultListItem>
  )
}
