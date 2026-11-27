import { Typography } from "@mui/material"

interface PunchTeamMemberProps {
  name: string
}

/**
 * Name of the relay leg runner who punched, under the team's name, styled like the members of a
 * team results row.
 * @param props.name Full name of the runner.
 */
export default function PunchTeamMember({ name }: PunchTeamMemberProps) {
  return <Typography sx={{ color: "text.secondary", fontSize: "small" }}>{name}</Typography>
}
