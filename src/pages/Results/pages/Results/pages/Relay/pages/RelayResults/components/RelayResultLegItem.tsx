import { RunnerModel } from "../../../../../../../../../shared/EntityTypes.ts"
import { Box, Typography } from "@mui/material"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import { parseResultStatus } from "../../../../../../../shared/functions.ts"

type RelayResultLegItemProps = {
  runner: RunnerModel
  handleRowClick?: (runner: RunnerModel) => void
}

export default function RelayResultLegItem({ runner, handleRowClick }: RelayResultLegItemProps) {
  const status = parseResultStatus(runner.stage.status_code as string)
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
      onClick={handleRowClick ? () => handleRowClick(runner) : undefined}
    >
      <Box sx={{ display: "table-cell", textAlign: "left", padding: "4px 0px" }}>
        <Typography sx={{ fontSize: "small" }}>{`${runner.leg_number}.`}</Typography>
      </Box>
      <Box sx={{ display: "table-cell", overflow: "hidden", textAlign: "left" }}>
        <Typography sx={{ fontSize: "small" }}>{runner.full_name}</Typography>
      </Box>
      <Box sx={{ display: "table-cell", textAlign: "right" }}>
        <RaceTime
          displayStatus
          isFinalTime={hasChipDownload}
          status={status}
          finish_time={runner.stage.finish_time}
          time_seconds={runner.stage.time_seconds}
          start_time={runner.stage.start_time}
          style={{ fontSize: "small" }}
        />
      </Box>
    </Box>
  )
}
