import { Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../../../shared/Functions.tsx"
import { RadioSplitModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { NowContext } from "../../../../../../../../../shared/context.ts"
import { DateTime } from "luxon"

type RunnerOnlineSplitProps = {
  split: RadioSplitModel
  startTimeTimestamp: string | null
}

export default function RunnerOnlineSplit({ split, startTimeTimestamp }: RunnerOnlineSplitProps) {
  // Reading for this split
  if (split.cumulative_time) {
    return <Typography>{parseSecondsToMMSS(split.cumulative_time)}</Typography>

    // No reading for this split
  } else {
    // Running to this control
    if (split.is_next !== null) {
      return (
        <NowContext.Consumer>
          {(nowDateTime) => {
            // Compute difference
            if (startTimeTimestamp === null) {
              // no start time, to provisional time
              return ""
            }
            const startTime = DateTime.fromISO(startTimeTimestamp)
            const provTime = nowDateTime.diff(startTime)

            if (provTime.as("days") >= 1) {
              return ""
            } else {
              return (
                <Typography
                  sx={{ color: "text.secondary" }}
                >{`(${parseSecondsToMMSS(provTime.as("seconds"))})`}</Typography>
              )
            }
          }}
        </NowContext.Consumer>
      )
      // Running to a previous control
    } else {
      return ""
    }
  }
}
