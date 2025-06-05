import React from "react"
import { ProcessedRunnerModel } from "./shared/EntityTypes.ts"
import Grid from "@mui/material/Grid"
import { Box, Link, SxProps, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

type VirtualTicketRunnerInfoProps = {
  runner: ProcessedRunnerModel
  setClassClubId: (newClassOrClubId: string, isClass: boolean) => void
}

/**
 * Display a runners name, club and class within a virtual ticket.
 * @param runner Runner to be displayed
 * @param setClassClubId The function to change to another class or club. It is used to provide links with-in the club and club fields
 */
const VirtualTicketRunnerInfo: React.FC<VirtualTicketRunnerInfoProps> = ({
  runner,
  setClassClubId,
}) => {
  const { t } = useTranslation()
  const textStyles: SxProps = {
    fontSize: "small",
    color: "text.secondary",
    textDecoration: "none",
  }

  return (
    <Grid item xs={12} sx={{ mb: 1 }}>
      <Typography sx={{ fontWeight: "bold" }}>{`${runner.full_name}`}</Typography>
      <Box
        sx={{
          width: "100%",
          display: "inline-flex",
          justifyContent: "space-between",
        }}
      >
        <Link
          sx={{
            ...textStyles,
            cursor: runner.club ? "pointer" : undefined,
            "&hover": {
              backgroundColor: runner.club ? "#fffbf0" : undefined,
            },
          }}
          onClick={
            runner.club
              ? () => setClassClubId(runner.club?.id ? runner.club.id : "", false) // the inner ternary operator is for type safety
              : undefined
          }
        >
          {runner.club ? `${runner.club.short_name}` : t("ResultsStage.NoClubMsg")}
        </Link>
        <Link
          sx={{
            ...textStyles,
            cursor: "pointer",
            "&hover": {
              backgroundColor: "#fffbf0",
            },
          }}
          onClick={() => setClassClubId(runner.class.id, true)}
        >
          {runner.class.short_name}
        </Link>
      </Box>
    </Grid>
  )
}

export default VirtualTicketRunnerInfo
