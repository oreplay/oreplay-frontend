import { ProcessedRunnerModel } from "../../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import GeneralErrorFallback from "../../../../../../../../../../../../components/GeneralErrorFallback.tsx"
import { Grid, Typography } from "@mui/material"

interface RelayVirtualTicketLegBannerProps {
  runner: ProcessedRunnerModel
  leg: number
}

export default function RelayVirtualTicketLegBanner({
  runner,
  leg,
}: RelayVirtualTicketLegBannerProps) {
  const legRunner = runner.runners?.at(leg - 1)

  if (!legRunner) {
    return <GeneralErrorFallback />
  }

  return (
    <Grid item xs={12} sx={{ mb: 1 }}>
      <Typography sx={{ fontWeight: "bold" }}>{legRunner.full_name}</Typography>
    </Grid>
  )
}
