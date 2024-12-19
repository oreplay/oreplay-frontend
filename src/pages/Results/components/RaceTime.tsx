import React from "react";
import {RESULT_STATUS_TEXT} from "../shared/constants.ts";
import {Typography} from "@mui/material";
import {parseSecondsToMMSS} from "../../../shared/Functions.tsx";
import {useTranslation} from "react-i18next";
import {NowContext} from "../shared/context.ts";
import {DateTime} from "luxon";

type FinishTimeProps = {
  status:string|null,
  start_time?:string|null,
  finish_time:string|null,
  time_seconds:number|string|null
}

const style = {}

const RaceTime: React.FC<FinishTimeProps> = ({status,finish_time,time_seconds}) => {
const RaceTime: React.FC<FinishTimeProps> = ({
  status,
  finish_time,
  time_seconds,
  start_time
}) => {
  const {t} = useTranslation();

  let parsedStyle = {
    ...style
  }

  if(status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc) {
    if (finish_time != null) {
      if (time_seconds !== null) {
        return (
          <Typography sx={parsedStyle}>
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
                if (provTimeSeconds > 0) {
                  return (
                    <Typography sx={{...parsedStyle,color:'text.secondary'}}>
                      {`(${parseSecondsToMMSS(provTimeSeconds)})`}
                    </Typography>
                  )
                } else {
                  // not started
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
          <Typography sx={parsedStyle}>
            {t('ResultsStage.')}
          </Typography>
        )
      }
    }
  } else {
    switch (status) {
      case RESULT_STATUS_TEXT.mp:
        parsedStyle = {
          ...style,
          color:'red'
        }
        break;

      default:
        break;
    }
    return (
      <Typography sx={parsedStyle}>
        {t(`ResultsStage.statusCodes.${status}`)}
      </Typography>
    )
  }
}

export default RaceTime;