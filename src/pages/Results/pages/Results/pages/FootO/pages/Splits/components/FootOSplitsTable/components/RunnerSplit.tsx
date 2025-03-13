import { Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../../../shared/Functions.tsx"
import { ProcessedSplitModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

type RunnerSplitProps = {
  split: ProcessedSplitModel
  showCumulative?: boolean
}

const styles = {
  fontSize: "small",
}

export default function RunnerSplit({ split, showCumulative }: RunnerSplitProps) {
  if (showCumulative) {
    const isScratch = split.cumulative_position === 1
    return (
      <>
        <Typography sx={{ fontWeight: isScratch ? "bold" : undefined, ...styles }}>
          {split.cumulative_time !== null ? parseSecondsToMMSS(split.cumulative_time) : "--"}
        </Typography>
        <Typography sx={{ fontWeight: isScratch ? "bold" : undefined, ...styles }}>
          {split.cumulative_behind !== null
            ? `+${parseSecondsToMMSS(split.cumulative_behind)} (${split.cumulative_position})`
            : "--"}
        </Typography>
      </>
    )
  } else {
    const isScratch = split.position === 1
    return (
      <>
        <Typography sx={{ fontWeight: isScratch ? "bold" : undefined, ...styles }}>
          {split.time !== null ? parseSecondsToMMSS(split.time) : "--"}
        </Typography>
        <Typography sx={{ fontWeight: isScratch ? "bold" : undefined, ...styles }}>
          {split.time_behind !== null
            ? `+${parseSecondsToMMSS(split.time_behind)} (${split.position})`
            : "--"}
        </Typography>
      </>
    )
  }
}
