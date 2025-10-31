import { CSSProperties } from "react"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { useTranslation } from "react-i18next"
import { RESULT_STATUS_TEXT } from "../../../../../../../../shared/constants.ts"
import { Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../../shared/Functions.tsx"
import { NowContext } from "../../../../../../../../shared/context.ts"
import { DateTime } from "luxon"
import Status from "../../../../../../components/Status.tsx"
import { parseResultStatus } from "../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import { liveRelayTime } from "../../../../shared/functions.ts"

interface RelayRaceTimeProps {
  displayStatus?: boolean
  isFinalTime?: boolean
  runner: ProcessedRunnerModel
  style?: CSSProperties
}

/**
 * TODO: This component is mostly copy pasted from the good old `RaceTime`. `RaceTime` has no test
 * and it is time to build them. More over, A general Time component should be abstracted that takes
 * into account if a time computing function.
 **/

/**
 * Component to display the final and in-race time of a relay team
 * @param displayStatus should the team status be displayed?
 * @param isFinalTime display it as final or provisional
 * @param runner The runner entity with the full team result
 * @param style Some css properties to be applied to the typography
 */
export default function RelayRaceTime({
  displayStatus,
  isFinalTime,
  runner,
  style,
}: RelayRaceTimeProps) {
  const { t } = useTranslation()

  const status = parseResultStatus(runner.stage.status_code!)
  const finish_time = runner.stage.finish_time
  const time_seconds = runner.stage.time_seconds
  const start_time = runner.stage.start_time

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
      if (!finish_time && time_seconds && isFinalTime) {
        // Some relay exports do not have start_time nor finish_time
        return <Typography sx={style}>{parseSecondsToMMSS(time_seconds)}</Typography>
      } else if (start_time != null) {
        return (
          <NowContext.Consumer>
            {(nowDateTime) => {
              const startTime = DateTime.fromISO(start_time)
              const provTimeSeconds = liveRelayTime(runner, nowDateTime)!

              // In race
              if (startTime <= nowDateTime) {
                // Check if runner died
                if (provTimeSeconds >= 86400) {
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
