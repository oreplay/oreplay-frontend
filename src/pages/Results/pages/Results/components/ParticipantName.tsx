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
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography sx={{ fontSize: "1em", color: color }}>{name}</Typography>
      {subtitle ? (
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "small",
          }}
        >
          {subtitle}
        </Typography>
      ) : (
        <></>
      )}
    </Box>
  )
}

export default ParticipantName
