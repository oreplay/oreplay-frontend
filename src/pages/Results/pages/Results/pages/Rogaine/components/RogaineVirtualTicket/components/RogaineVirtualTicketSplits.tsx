import React from "react"
import { ProcessedSplitModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketControl from "../../../../../../../components/VirtualTicket/VirtualTicketControl.tsx"
import { Grid, Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../shared/Functions.tsx"

type RogaineVirtualTicketProps = {
  split: ProcessedSplitModel
}

/**
 * Display a rogaine splits line within a virtual ticket.
 * @param split Split to be displayed
 */
const RogaineVirtualTicketSplit: React.FC<RogaineVirtualTicketProps> = ({ split }) => {
  return (
    <>
      <VirtualTicketControl
        control={split.control}
        order_number={split.order_number}
        points={split.points}
        gridWidth={3}
      />
      <Grid item xs={4}>
        <Typography>{split.time !== null ? `${parseSecondsToMMSS(split.time)}` : "--"}</Typography>
      </Grid>
      <Grid item xs={5}>
        <Typography>
          {split.cumulative_time !== null ? `${parseSecondsToMMSS(split.cumulative_time)}` : "--"}
        </Typography>
      </Grid>
    </>
  )
}

export default RogaineVirtualTicketSplit
