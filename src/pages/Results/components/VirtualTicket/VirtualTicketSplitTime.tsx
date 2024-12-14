import React from 'react'
import {Grid, Typography} from "@mui/material";
import {parseSecondsToMMSS} from "../../../../shared/Functions.tsx";

type VirtualTicketSplitTimeProp = {
  time: number|null
  time_behind: number|null
  position: number|null
}

/**
 * Displays time, time difference and position of a split. It handles null values
 * @param time time in seconds for the split
 * @param time_behind difference to the best split in seconds
 * @param position partial position
 * @constructor
 */
const VirtualTicketSplitTime: React.FC<VirtualTicketSplitTimeProp> = ({time,time_behind, position}) => {
  const style = {
    fontWeight: position == 1 ? 'bold' : undefined,
  }

  return (<>
    <Grid item xs={2}>
      <Typography sx={style}>{time !== null ? `${parseSecondsToMMSS(time)}` : "--"}</Typography>
    </Grid>
    <Grid item xs={3}>
      <Typography sx={style}>{time_behind !== null ? `+${parseSecondsToMMSS(time_behind)} (${position})` : "--"}</Typography>
    </Grid>
  </>)
}

export default VirtualTicketSplitTime;
