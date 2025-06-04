import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseResultStatus } from "../../../../../../../shared/functions.ts"
import { RESULT_STATUS_TEXT } from "../../../../../../../shared/constants.ts"
import RacePosition from "../../../../../../../components/RacePosition..tsx"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import RaceTimeBehind from "../../../../../../../components/RaceTimeBehind.tsx"
import { hasChipDownload as hasChipDownloadFunction } from "../../../../../shared/functions.ts"
import { Box, Typography } from "@mui/material"
import RelayResultLegItem from "./RelayResultLegItem.tsx"

export default function RelayResultItem({
  runner,
}: {
  runner: ProcessedRunnerModel
  handleRowClick: (runner: ProcessedRunnerModel) => void
}) {
  const status = parseResultStatus(runner.overall.status_code as string)
  const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
  const hasChipDownload = hasChipDownloadFunction(runner)

  return (
    <Box sx={{ display: "table-row", borderBottom: "1px solid #f2f2f2"}}>
      <Box sx={{ display: "table-cell", padding: "12px 2px" }}>
        <RacePosition
          position={runner.overall.position}
          hasDownload={hasChipDownload}
          isNC={status === RESULT_STATUS_TEXT.nc}
        />
      </Box>
      <Box sx={{ display: "table-cell", padding: "12px 2px" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "inline-flex",
              gap: "5px",
            }}
          >
            <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
              <Typography sx={{ fontSize: "1em", color: "inherit", overflow: "hidden" }}>
                {runner.full_name}
              </Typography>
            </Box>
            <RaceTime
              displayStatus
              isFinalTime={hasChipDownload}
              status={status}
              finish_time={runner.overall.finish_time}
              time_seconds={runner.overall.time_seconds}
              start_time={runner.overall.start_time}
            />
            <RaceTimeBehind
              display={statusOkOrNc && runner.overall.finish_time != null && hasChipDownload}
              time_behind={runner.overall.time_behind}
            />
          </Box>
          <Box sx={{ display: "table" }}>
            {runner.runners?.map((legRunner) => <RelayResultLegItem key={legRunner.id} runner={legRunner} />)}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
