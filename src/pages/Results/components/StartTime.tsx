import React, { CSSProperties } from "react"
import { parseStartTime } from "../../../shared/Functions.tsx"
import { useTranslation } from "react-i18next"
import { Typography } from "@mui/material"
import { RESULT_STATUS } from "../shared/constants.ts"
import Status from "./Status.tsx"

type StartTimeProps = {
  displayStatus?: boolean
  startTime: string | null
  status?: string
  style?: CSSProperties
}

const StartTime: React.FC<StartTimeProps> = ({ startTime, status, displayStatus, style }) => {
  const { t } = useTranslation()
  if (startTime == null) {
    if (status != RESULT_STATUS.ok && displayStatus && status) {
      return <Status status={status} />
    } else {
      return t("ResultsStage.NoStartTime")
    }
  } else {
    const start = parseStartTime(startTime)

    return <Typography style={style}>{start}</Typography>
  }
}

export default StartTime
