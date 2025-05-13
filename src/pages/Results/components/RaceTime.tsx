import React, { CSSProperties } from "react"
import { RESULT_STATUS_TEXT } from "../shared/constants.ts"
import { Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../shared/Functions.tsx"
import { useTranslation } from "react-i18next"
import { NowContext } from "../shared/context.ts"
import { DateTime } from "luxon"
import Status from "./Status.tsx"

type FinishTimeProps = {
  displayStatus?: boolean
  isFinalTime?: boolean
  status: string | null
  start_time?: string | null
  finish_time: string | null
  time_seconds: number | string | null
  style?: CSSProperties
}

const RaceTime: React.FC<FinishTimeProps> = ({
  displayStatus,
  isFinalTime,
  status,
  finish_time,
  time_seconds,
  start_time,
  style,
}) => {
  const { t } = useTranslation()

  if (status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc) {
    if (finish_time != null && time_seconds !== null) {
      if (isFinalTime) {
        return <Typography sx={style}>{parseSecondsToMMSS(time_seconds)}</Typography>
      } else {
        return (
          <Typography sx={{ ...style, color: "text.secondary" }}>
            {parseSecondsToMMSS(time_seconds)}
          </Typography>
        )
      }
    } else {
      if (start_time != null && !finish_time && time_seconds && isFinalTime) {
        // Some relay exports do not have finish_time
        return <Typography sx={style}>{parseSecondsToMMSS(time_seconds)}</Typography>
      } else if (start_time != null) {
        return (
          <NowContext.Consumer>
            {(nowDateTime) => {
              const startTime = DateTime.fromISO(start_time)
              const provTime = nowDateTime.diff(startTime)
              const provTimeSeconds = provTime.as("seconds")

              // In race
              if (startTime <= nowDateTime) {
                // Check if runner died
                if (provTime.as("days") >= 1) {
                  return ""

                  // Still running
                } else {
                  return (
                    <Typography sx={{ ...style, color: "text.secondary" }}>
                      {`(${parseSecondsToMMSS(provTimeSeconds)})`}
                    </Typography>
                  )
                }

                // not started
              } else {
                return <Typography sx={style}>{t("ResultsStage.NotStarted")}</Typography>
              }
            }}
          </NowContext.Consumer>
        )
      } else {
        return <Typography sx={style}>{t("ResultsStage.NotStarted")}</Typography>
      }
    }
  } else {
    if (displayStatus && status) {
      return <Status status={status} style={style} />
    } else {
      return ""
    }
  }
}

export default RaceTime
