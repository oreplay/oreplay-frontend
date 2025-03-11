import { Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../../../shared/Functions.tsx"
import { ProcessedSplitModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

type RunnerSplitProps = {
  split: ProcessedSplitModel
  displayDiffs?: boolean
}

export default function RunnerSplit({ split, displayDiffs }: RunnerSplitProps) {
  if (displayDiffs) {
    return (
      <>
        <Typography sx={{ fontWeight: split.position === 1 ? "bold" : undefined }}>
          {split.time_behind !== null
            ? `+${parseSecondsToMMSS(split.time_behind)} (${split.position})`
            : "--"}
        </Typography>
        <Typography sx={{ fontWeight: split.cumulative_position === 1 ? "bold" : undefined }}>
          {split.cumulative_behind !== null
            ? `+${parseSecondsToMMSS(split.cumulative_behind)} (${split.cumulative_position})`
            : "--"}
        </Typography>
      </>
    )
  } else {
    return (
      <>
        <Typography sx={{ fontWeight: split.position === 1 ? "bold" : undefined }}>
          {split.time !== null ? `${parseSecondsToMMSS(split.time)} (${split.position})` : "--"}
        </Typography>
        <Typography sx={{ fontWeight: split.cumulative_position === 1 ? "bold" : undefined }}>
          {split.cumulative_time !== null
            ? `${parseSecondsToMMSS(split.cumulative_time)} (${split.position})`
            : "--"}
        </Typography>
      </>
    )
  }
}
