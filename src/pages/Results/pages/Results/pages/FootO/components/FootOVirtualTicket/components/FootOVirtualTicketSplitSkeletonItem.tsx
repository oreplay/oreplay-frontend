import { Grid, Skeleton } from "@mui/material"

export default function FootOVirtualTicketSplitSkeletonItem() {
  return (
    <Grid
      item
      xs={12}
      sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}
    >
      <Skeleton variant={"rounded"} width={"70px"} height={"39px"} />
      <Skeleton variant={"rounded"} width={"120px"} height={"39px"} />
      <Skeleton variant={"rounded"} width={"120px"} height={"39px"} />
    </Grid>
  )
}
