import React from "react";
import {RESULT_STATUS_TEXT} from "../shared/constants.ts";
import {Typography} from "@mui/material";
import {parseSecondsToMMSS} from "../../../shared/Functions.tsx";
import {useTranslation} from "react-i18next";
import {NowContext} from "../shared/context.ts";
import {DateTime} from "luxon";
import Status from "./Status.tsx";

type FinishTimeProps = {
  displayStatus?:boolean,
  status:string|null,
  start_time?:string|null,
  finish_time:string|null,
  time_seconds:number|string|null
}

const style = {}

const RaceTime: React.FC<FinishTimeProps> = ({
  displayStatus,
  status,
  finish_time,
  time_seconds,
  start_time
}) => {
  const {t} = useTranslation();

  if(status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc) {
    if (finish_time != null) {
      if (time_seconds !== null) {
        return (
          <Typography sx={style}>
            {parseSecondsToMMSS(time_seconds)}
          </Typography>
        )
      } else {
        // TODO: Handle in a better way. Maybe throw an exception
        console.error("If a runner has finish time it should has time_seconds")
        return (
          <Typography>
            Error
          </Typography>
        )
      }
    } else {
      if (start_time != null) {
        return (
          <NowContext.Consumer>
            {
              nowDateTime => {

                const startTime = DateTime.fromISO(start_time);
                const provTime = nowDateTime.diff(startTime)
                const provTimeSeconds = provTime.as('seconds')

                // In race
                if (startTime <= nowDateTime) {
                  // Check if runner died
                  if (provTime.as('days') >= 1.) {
                    return ""

                  // Still running
                  } else {
                    return (
                      <Typography sx={{...style, color: 'text.secondary'}}>
                        {`(${parseSecondsToMMSS(provTimeSeconds)})`}
                      </Typography>
                    )
                  }

                // not started
                } else {
                  return (
                    <Typography>
                      {t('ResultsStage.NotStarted')}
                    </Typography>
                  )
                }
              }
            }
          </NowContext.Consumer>
        )
      } else {
        return (
          <Typography sx={style}>
            {t('ResultsStage.NotStarted')}
          </Typography>
        )
      }
    }
  } else {
    if (displayStatus && status) {
      return <Status status={status} style={style}/>
    } else {
      return ""
    }
  }
}

export default RaceTime;