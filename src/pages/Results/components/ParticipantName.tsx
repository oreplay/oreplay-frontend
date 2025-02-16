import { Box, Typography } from "@mui/material";

const ParticipantName = ({ name, subtitle, color }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        width: "calc(100% -20px)",
        marginLeft: ".3em",
      }}
    >
      <Typography sx={{ color: color || "inherit" }}>{name}</Typography>
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: "small",
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default ParticipantName;