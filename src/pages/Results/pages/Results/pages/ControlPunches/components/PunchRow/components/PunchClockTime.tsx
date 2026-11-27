import { Typography } from "@mui/material"
import { formatPunchClockTime } from "../../../shared/punchDisplay.ts"

interface PunchClockTimeProps {
  readingTime: string
}

/**
 * Clock time of the punch, in the place a results row shows the position, since at a control the
 * order of the list is the order in which runners arrived.
 * @param props.readingTime Time of the punch, as ISO 8601 with offset.
 */
export default function PunchClockTime({ readingTime }: PunchClockTimeProps) {
  return (
    <Typography
      component="time"
      dateTime={readingTime}
      sx={{ flexShrink: 0, fontVariantNumeric: "tabular-nums", fontWeight: 600, marginRight: 1 }}
    >
      {formatPunchClockTime(readingTime)}
    </Typography>
  )
}
