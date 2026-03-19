import React, { useContext } from "react"
import { ProcessedRunnerModel } from "./shared/EntityTypes.ts"
import Grid from "@mui/material/Grid"
import { Box, Link, SxProps, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { VirtualTicketContext } from "./shared/context.tsx"

type VirtualTicketRunnerInfoProps = {
  runner: ProcessedRunnerModel
  setClassClubId: (newClassOrClubId: string, isClass: boolean) => void
  displayTeamMemberNames?: boolean
}

/**
 * Display a runners name, club and class within a virtual ticket.
 * @param runner Runner to be displayed
 * @param setClassClubId The function to change to another class or club. It is used to provide links with-in the club and club fields
 * @param displayTeamMemberNames If true, team members will be shown below club and class
 */
const VirtualTicketRunnerInfo: React.FC<VirtualTicketRunnerInfoProps> = ({
  runner,
  setClassClubId,
  displayTeamMemberNames,
}) => {
  const { t } = useTranslation()
  const textStyles: SxProps = {
    fontSize: "small",
    color: "text.secondary",
    textDecoration: "none",
  }

  // Click handlers
  const { handleClose } = useContext(VirtualTicketContext)
  const handleClassClick = () => {
    setClassClubId(runner.class.id, true)
    handleClose()
  }
  const handleClubClick = () => {
    if (runner.club) {
      setClassClubId(runner.club.id, false)
      handleClose()
    }
  }

  // Actual component
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
          onClick={handleClubClick}
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
          onClick={handleClassClick}
        >
          {runner.class.short_name}
        </Link>
      </Box>
      {displayTeamMemberNames ? (
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingTop: 1 }}
        >
          {runner.runners?.map((teamMember) => (
            <Typography key={teamMember.id} variant="body2" color="textSecondary">
              {teamMember.full_name}
            </Typography>
          ))}
        </Box>
      ) : null}
    </Grid>
  )
}

export default VirtualTicketRunnerInfo
