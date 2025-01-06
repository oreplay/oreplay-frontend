import { Box, Stack, Typography } from "@mui/material";

interface EventStageBannerProps {
  eventName: string;
  stageName: string;
  singleStage: boolean;
}

export default function EventStageBanner(props: EventStageBannerProps) {
  return (
    <Box
      sx={{
        fontWeight: "bold",
        paddingY: "1em", // Add left padding for a consistent margin
        paddingX: "24px",
        backgroundColor: "#efefef",
        textAlign: "left", // Ensure all text within this Box is left-aligned
      }}
    >
      {props.singleStage ? (
        <Typography
          sx={{
            color: "secondary.main",
            fontSize: "1.1rem",
          }}
        >
          {props.eventName}
        </Typography>
      ) : (
        <Stack direction="column" spacing={1}>
          <Typography
            sx={{
              color: "secondary.main",
              fontSize: "1.1rem",
            }}
          >
            {props.stageName}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: ".8rem",
            }}
          >
            {props.eventName}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
