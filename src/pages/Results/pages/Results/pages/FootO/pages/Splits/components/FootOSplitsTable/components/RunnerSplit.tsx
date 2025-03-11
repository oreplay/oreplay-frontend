import { Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../../../shared/Functions.tsx"
import {
  ProcessedSplitModel
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

type RunnerSplitProps = {
  split: ProcessedSplitModel
  displayDiffs?: boolean
}

export default function RunnerSplit({
  split,
  displayDiffs,
}: RunnerSplitProps) {
  if (displayDiffs) {
    return (
      <>
        <Typography>{split.time_behind !== null ? `+${parseSecondsToMMSS(split.time_behind)}` : "--"}</Typography>
        <Typography>
          {split.cumulative_behind !== null ? `+${parseSecondsToMMSS(split.cumulative_behind)}` : "--"}
        </Typography>
      </>
    )
  } else {
    return (
      <>
        <Typography>{split.time !== null ? parseSecondsToMMSS(split.time) : "--"}</Typography>
        <Typography>
          {split.cumulative_time !== null ? parseSecondsToMMSS(split.cumulative_time) : "--"}
        </Typography>
      </>
    )
  }
}
