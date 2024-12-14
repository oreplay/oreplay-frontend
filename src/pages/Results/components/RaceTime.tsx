import React from "react";
import {RESULT_STATUS_TEXT} from "../shared/constants.ts";
import {Typography} from "@mui/material";
import {parseSecondsToMMSS} from "../../../shared/Functions.tsx";
import {useTranslation} from "react-i18next";

type FinishTimeProps = {
  status:string|null,
  finish_time:string|null,
  time_seconds:number|string|null
}

const style = {}

const RaceTime: React.FC<FinishTimeProps> = ({status,finish_time,time_seconds}) => {
  const {t} = useTranslation();

  let parsedStyle = {
    ...style
  }

  if(status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc) {
    return (
      <Typography sx={parsedStyle}>
        {finish_time != null && time_seconds !== null ? parseSecondsToMMSS(time_seconds) : "-"}
      </Typography>
    )
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