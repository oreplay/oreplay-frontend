import React from "react"
import { Box, Grid, Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../shared/Functions.tsx"

type VirtualTicketSplitTimeProp = {
  time: number | null
  time_behind: number | null
  position: number | null
}

/**
 * Displays time, time difference and position of a split. It handles null values
 * @param time time in seconds for the split
 * @param time_behind difference to the best split in seconds
 * @param position partial position
 * @constructor
 */
const VirtualTicketSplitTime: React.FC<VirtualTicketSplitTimeProp> = ({
  time,
  time_behind,
  position,
}) => {
  const style = {
    fontWeight: position == 1 ? "bold" : undefined,
    whiteSpace: "nowrap",
    fontSize: "small",
  }

  return (
    <Grid item xs={5}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          columnGap: 1,
          rowGap: 0,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Typography sx={style}>{time !== null ? `${parseSecondsToMMSS(time)}` : "--"}</Typography>
        <Typography sx={style}>
          {time_behind !== null ? `+${parseSecondsToMMSS(time_behind)} (${position})` : "--"}
        </Typography>
      </Box>
    </Grid>
  )
}

export default VirtualTicketSplitTime
