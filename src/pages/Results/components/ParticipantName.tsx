import { Box, Typography } from "@mui/material";

const ParticipantName = ({ name, subtitle }) => {
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
      <Typography>{name}</Typography>
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