import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseResultStatus } from "../../../../../../../shared/sortingFunctions/sortRunners.ts"
import { RESULT_STATUS_TEXT } from "../../../../../../../shared/constants.ts"
import RacePosition from "../../../../../../../components/RacePosition..tsx"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import RaceTimeBehind from "../../../../../../../components/RaceTimeBehind.tsx"
import {
  hasChipDownload as hasChipDownloadFunction,
  isRunnerNC,
} from "../../../../../shared/functions.ts"
import { Box } from "@mui/material"
import RelayResultLegItem from "./RelayResultLegItem.tsx"
import ParticipantName from "../../../../../../../components/ParticipantName.tsx"

export default function RelayResultItem({
  runner,
  handleRowClick,
  isClass,
}: {
  runner: ProcessedRunnerModel
  handleRowClick: (runner: ProcessedRunnerModel, leg: number) => void
  isClass: boolean
}) {
  const status = parseResultStatus(runner.stage.status_code as string)
  const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || isRunnerNC(runner)
  const hasChipDownload = hasChipDownloadFunction(runner)

  return (
    <Box sx={{ display: "table-row", borderBottom: "1px solid #f2f2f2" }}>
      <Box sx={{ display: "table-cell", padding: "12px 2px" }}>
        <RacePosition
          position={runner.stage.position}
          hasDownload={hasChipDownload}
          isNC={isRunnerNC(runner)}
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
              <ParticipantName
                name={runner.full_name}
                subtitle={!isClass ? runner.class?.short_name : undefined} //TODO: Temporally consider runner.class nullable until back gets fixed
              />
            </Box>
            <RaceTime
              displayStatus
              isFinalTime={hasChipDownload}
              status={status}
              finish_time={runner.stage.finish_time}
              time_seconds={runner.stage.time_seconds}
              start_time={runner.stage.start_time}
            />
            <RaceTimeBehind
              display={statusOkOrNc && runner.stage.finish_time != null && hasChipDownload}
              time_behind={runner.stage.time_behind}
            />
          </Box>
          <Box sx={{ display: "table" }}>
            {runner.runners?.map((legRunner) => (
              <RelayResultLegItem
                key={legRunner.id}
                runner={runner}
                legParticipant={legRunner}
                handleRowClick={handleRowClick}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
