import { RunnerModel } from "../../../../../../../../../shared/EntityTypes.ts"
import FlexCol from "../../../../../../../components/FlexCol.tsx"
import { Typography } from "@mui/material"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import { parseResultStatus } from "../../../../../../../shared/functions.ts"
import ResultListItem from "../../../../../../../components/ResultsList/ResultListItem.tsx"

type RelayResultLegItemProps = {
  runner: RunnerModel
  handleRowClick: (runner: RunnerModel) => void
  legNumber: number
}

export default function RelayResultLegItem({
  runner,
  handleRowClick,
  legNumber,
}: RelayResultLegItemProps) {
  const status = parseResultStatus(runner.overall.status_code as string)
  const hasChipDownload = true //hasChipDownloadFunction(runner) // TODO: Uncomment after backend bug fix

  return (
    <ResultListItem onClick={() => handleRowClick(runner)}>
      <FlexCol width={"10px"}>
        <Typography>{`${legNumber + 1}.`}</Typography>
      </FlexCol>
      <FlexCol flexGrow={1}>
        <Typography>{runner.full_name}</Typography>
      </FlexCol>
      <FlexCol flexGrow={1}>
        <RaceTime
          displayStatus
          isFinalTime={hasChipDownload}
          status={status}
          finish_time={runner.overall.finish_time}
          time_seconds={runner.overall.time_seconds}
          start_time={runner.overall.start_time}
        />
      </FlexCol>
    </ResultListItem>
  )
}
