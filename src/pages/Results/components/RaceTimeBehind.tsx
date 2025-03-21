import React from "react"
import { Typography } from "@mui/material"
import { parseTimeBehind } from "../../../shared/Functions.tsx"

type RaceTimeBehindProps = {
  display?: boolean
  time_behind: number | null
}

const RaceTimeBehind: React.FC<RaceTimeBehindProps> = ({ display, time_behind }) => {
  if (display && time_behind) {
    return (
      <Typography sx={{ color: "primary.main", fontSize: 14 }}>
        {parseTimeBehind(time_behind)}
      </Typography>
    )
  } else {
    return <Typography sx={{ color: "primary.main", fontSize: 14 }}></Typography>
  }
}

export default RaceTimeBehind
