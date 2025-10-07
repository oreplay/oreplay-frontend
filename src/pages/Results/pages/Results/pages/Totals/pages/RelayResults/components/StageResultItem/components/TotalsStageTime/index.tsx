import { RESULT_STATUS } from "../../../../../../../../../../shared/constants.ts"
import { Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../../../../shared/Functions.tsx"
import { parseResultStatus } from "../../../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import Status from "../../../../../../../../components/Status.tsx"
import { CSSProperties } from "react"

interface TotalStageTimeProps {
  displayStatus?: boolean
  highlight?: boolean
  time: number
  status: string
  position: number
}

const style: CSSProperties = {
  fontSize: "small",
  color: "text.secondary",
}

export default function TotalsStageTime({
  displayStatus,
  time,
  status,
  highlight,
  position,
}: TotalStageTimeProps) {
  const trueStyle = { ...style, color: highlight ? "primary.main" : undefined }

  if (time) {
    // Runner did run the race

    if (!displayStatus || status == RESULT_STATUS.ok || status === RESULT_STATUS.nc) {
      return <Typography sx={style}>{`${parseSecondsToMMSS(time)} (${position})`}</Typography>
    } else if (displayStatus) {
      return <Status status={parseResultStatus(status)} style={trueStyle} />
    }
  }

  return <Typography sx={trueStyle}>{"--"}</Typography>
}
