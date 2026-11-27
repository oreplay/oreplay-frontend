import { Typography } from "@mui/material"
import { formatPunchElapsedTime } from "../../../shared/punchDisplay.ts"

interface PunchElapsedTimeProps {
  elapsedSeconds: number | null
}

/**
 * Time the participant took from the start to the control, on the right of the row like the race
 * time of a results row. Renders nothing when the start is unknown.
 * @param props.elapsedSeconds Seconds from the start to the punch; `null` when the start is unknown.
 */
export default function PunchElapsedTime({ elapsedSeconds }: PunchElapsedTimeProps) {
  const elapsedTime = formatPunchElapsedTime(elapsedSeconds)
  if (elapsedTime === null) {
    return null
  }
  return <Typography sx={{ fontVariantNumeric: "tabular-nums" }}>{elapsedTime}</Typography>
}
