import React, { CSSProperties } from "react"
import { parseStartTime } from "../../../../../shared/Functions.tsx"
import { Typography } from "@mui/material"
import { RESULT_STATUS_TEXT } from "../../../shared/constants.ts"
import Status from "./Status.tsx"

type StartTimeProps = {
  displayStatus?: boolean
  startTime: string | null
  status?: string
  style?: CSSProperties
}

/**
 * Display the start time of a runner
 * @param startTime start time ISO string
 * @param status result_status_text string
 * @param displayStatus weather to display the status of a runner when it is not ok and the runner doesn't have a start time. This is useful to display DNS runners without start time.
 * @param style
 * @constructor
 */
const StartTime: React.FC<StartTimeProps> = ({ startTime, status, displayStatus, style }) => {
  if (startTime == null) {
    if (status != RESULT_STATUS_TEXT.ok && displayStatus && status) {
      return <Status status={status} />
    }
  } else {
    const start = parseStartTime(startTime)

    return <Typography style={style}>{start}</Typography>
  }
}

export default StartTime
