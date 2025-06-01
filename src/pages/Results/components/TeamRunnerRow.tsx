import { Box } from "@mui/material"
import ParticipantName from "./ParticipantName"
import FlexRow from "./FlexRow.tsx"
import { RunnerModel } from "../../../shared/EntityTypes.ts"

interface TeamRunnerRowProps {
  runner: RunnerModel
}

const TeamRunnerRow: React.FC<TeamRunnerRowProps> = ({ runner }) => {
  const name = runner.full_name
  const card = "" + runner.sicard
  let leg = ""
  if (runner?.stage?.leg_number) {
    leg = "(" + runner?.stage?.leg_number + ")"
  }
  return (
    <FlexRow
      sx={{
        marginTop: "2px",
        fontSize: "12px",
        color: "text.secondary",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ marginInlineStart: "12px" }}>{leg}</Box>
      <ParticipantName name={name} color="text.secondary" />
      <Box sx={{ color: "text.secondary" }}>{card}</Box>
    </FlexRow>
  )
}

export default TeamRunnerRow
