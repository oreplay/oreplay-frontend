import React, { CSSProperties } from "react"
import { ProcessedRunnerModel } from "./shared/EntityTypes.ts"
import Grid from "@mui/material/Grid"
import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

type VirtualTicketRunnerInfoProps = {
  runner: ProcessedRunnerModel
}

/**
 * Display a runners name, club and class within a virtual ticket.
 * @param runner Runner to be displayed
 */
const VirtualTicketRunnerInfo: React.FC<VirtualTicketRunnerInfoProps> = ({ runner }) => {
  const { t } = useTranslation()
  const textStyles: CSSProperties = {
    fontSize: "small",
    color: "text.secondary",
  }

  return (
    <Grid item xs={12} sx={{ mb: 1 }}>
      <Typography sx={{ fontWeight: "bold" }}>
        {`${runner.full_name}`}
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "inline-flex",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={textStyles}>
          {runner.club ? `${runner.club.short_name}` : t("ResultsStage.NoClubMsg")}
        </Typography>
        <Typography sx={textStyles}>{runner.class.short_name}</Typography>
      </Box>
    </Grid>
  )
}

export default VirtualTicketRunnerInfo
