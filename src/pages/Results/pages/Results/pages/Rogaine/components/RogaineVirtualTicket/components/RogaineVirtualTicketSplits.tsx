import React from "react"
import { ProcessedSplitModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketControl from "../../../../../../../components/VirtualTicket/VirtualTicketControl.tsx"
import { Grid } from "@mui/material"
import VirtualTicketSplitTime from "../../../../../../../components/VirtualTicket/VirtualTicketSplitTime.tsx"

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
    <Grid style={{display: "flex", width: "100%", backgroundColor: index % 2 ? "white" : "#fcefde"}}>
      <VirtualTicketControl
        control={split.control}
        order_number={split.order_number}
        points={split.points}
        gridWidth={2}
      />
      <VirtualTicketSplitTime
        time={split.time}
        time_behind={split.time_behind}
        position={split.position}
      />
      <VirtualTicketSplitTime
        time={split.cumulative_time}
        time_behind={split.cumulative_behind}
        position={split.cumulative_position}
      />
    </Grid>
  )
}

export default RogaineVirtualTicketSplit
