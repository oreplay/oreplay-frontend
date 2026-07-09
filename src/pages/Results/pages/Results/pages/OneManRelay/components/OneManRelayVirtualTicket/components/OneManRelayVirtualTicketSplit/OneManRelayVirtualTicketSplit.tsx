import { ProcessedSplitModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { Grid, Typography } from "@mui/material"
import VirtualTicketControl from "../../../../../../../../components/VirtualTicket/VirtualTicketControl.tsx"
import { parseSecondsToMMSS } from "../../../../../../../../../../shared/Functions.tsx"

interface OneManRelayVirtualTicketSplitProps {
  split: ProcessedSplitModel
  index: number
}

export default function OneManRelayVirtualTicketSplit({
  split,
  index,
}: OneManRelayVirtualTicketSplitProps) {
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
