import { Box, Typography } from "@mui/material"

interface ParticipantNameProps {
  name: string
  subtitle?: string
  color?: string
}

const ParticipantName = ({ name, subtitle = "", color = "inherit" }: ParticipantNameProps) => {
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
