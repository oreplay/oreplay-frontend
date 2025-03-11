import { Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../../../shared/Functions.tsx"

type RunnerSplitProps = {
  time: number | null
  cumulativeTime: number | null
  difference: number | null
  cumulativeDifference: number | null
  displayDiffs?: boolean
}

export default function RunnerSplit({
  time,
  cumulativeTime,
  difference,
  cumulativeDifference,
  displayDiffs,
}: RunnerSplitProps) {
  if (displayDiffs) {
    return (
      <>
        <Typography>{difference !== null ? `+${parseSecondsToMMSS(difference)}` : "--"}</Typography>
        <Typography>
          {cumulativeDifference !== null ? `+${parseSecondsToMMSS(cumulativeDifference)}` : "--"}
        </Typography>
      </>
    )
  } else {
    return (
      <>
        <Typography>{time !== null ? parseSecondsToMMSS(time) : "--"}</Typography>
        <Typography>
          {cumulativeTime !== null ? parseSecondsToMMSS(cumulativeTime) : "--"}
        </Typography>
      </>
    )
  }
}
