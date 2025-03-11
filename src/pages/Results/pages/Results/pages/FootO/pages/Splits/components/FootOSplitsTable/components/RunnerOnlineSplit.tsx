import { Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../../../shared/Functions.tsx"
import { RadioSplitModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { NowContext } from "../../../../../../../../../shared/context.ts"

type RunnerOnlineSplitProps = {
  split: RadioSplitModel
}

export default function RunnerOnlineSplit({ split }: RunnerOnlineSplitProps) {
  // Reading for this split
  if (split.time) {
    return <Typography>{parseSecondsToMMSS(split.time)}</Typography>

    // No reading for this split
  } else {
    // Running to this control
    if (split.is_next !== null) {
      return (
        <NowContext.Consumer>
          {(nowDateTime) => {
            const provTime = nowDateTime.diff(split.is_next!)

            if (provTime.as("days") >= 1) {
              return ""
            } else {
              return <Typography>{`(${parseSecondsToMMSS(provTime.as("seconds"))})`}</Typography>
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
