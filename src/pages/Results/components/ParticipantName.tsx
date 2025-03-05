import { Box, Typography } from "@mui/material"
import React from "react"

interface ParticipantNameProps {
  name: string
  subtitle?: string
  color?: string
}

const ParticipantName: React.FC<ParticipantNameProps> = ({
  name,
  subtitle = "",
  color = "inherit",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        width: "calc(100% - 20px)",
        marginLeft: ".3em",
      }}
    >
      <Typography sx={{ fontSize: "1em", color: color }}>{name}</Typography>
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: "small",
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  )
}

export default ParticipantName
