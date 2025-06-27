import { Box, Typography } from "@mui/material"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import { parseResultStatus } from "../../../../../../../shared/functions.ts"
import { ProcessedTeamRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

type RelayResultLegItemProps = {
  legParticipant: ProcessedTeamRunnerModel
  handleRowClick?: (runner: ProcessedTeamRunnerModel) => void
}

export default function RelayResultLegItem({
  legParticipant,
  handleRowClick,
}: RelayResultLegItemProps) {
  const status = parseResultStatus(legParticipant.stage.status_code as string)
  const hasChipDownload = true //hasChipDownloadFunction(runner) // TODO: Uncomment after backend bug fix

  return (
    <Box
      sx={{
        display: "table-row",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#fffbf0",
        },
      }}
      onClick={handleRowClick ? () => handleRowClick(legParticipant) : undefined}
    >
      <Box sx={{ display: "table-cell", textAlign: "left", padding: "4px 0px" }}>
        <Typography sx={{ fontSize: "small" }}>{`${legParticipant.leg_number}.`}</Typography>
      </Box>
      <Box sx={{ display: "table-cell", overflow: "hidden", textAlign: "left" }}>
        <Typography sx={{ fontSize: "small" }}>{legParticipant.full_name}</Typography>
      </Box>
      <Box sx={{ display: "table-cell", textAlign: "right" }}>
        <RaceTime
          displayStatus
          isFinalTime={hasChipDownload}
          status={status}
          finish_time={legParticipant.stage.finish_time}
          time_seconds={legParticipant.stage.time_seconds}
          start_time={legParticipant.stage.start_time}
          style={{ fontSize: "small" }}
        />
      </Box>
    </Box>
  )
}
