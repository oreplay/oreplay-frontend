import React from "react"
import { ProcessedSplitModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketControl from "../../../../../../../components/VirtualTicket/VirtualTicketControl.tsx"
import { Grid, Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../shared/Functions.tsx"

type RogaineVirtualTicketProps = {
  split: ProcessedSplitModel
  index: number
}

/**
 * Display a rogaine splits line within a virtual ticket.
 * @param split Split to be displayed
 */
const RogaineVirtualTicketSplit: React.FC<RogaineVirtualTicketProps> = ({ split, index }) => {
  return (
    <Grid
      style={{ display: "flex", width: "100%", backgroundColor: index % 2 ? "white" : "#fcefde" }}
    >
      <VirtualTicketControl
        control={split.control}
        order_number={split.order_number}
        points={split.points}
        gridWidth={3}
      />
      <Grid item xs={4}>
        <Typography sx={{ textAlign: "center" }}>
          {split.time !== null ? parseSecondsToMMSS(split.time) : "--"}
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <Typography sx={{ textAlign: "center" }}>
          {split.cumulative_time !== null ? parseSecondsToMMSS(split.cumulative_time) : "--"}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default RogaineVirtualTicketSplit
