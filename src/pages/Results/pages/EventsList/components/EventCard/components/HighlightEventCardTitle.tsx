import { Box, Typography } from "@mui/material"

interface HighlightEventCardTitleProps {
  title: string
}

const HEIGHT_LINE_CLAMP_SUPPORTED = "@supports (line-clamp: auto)"

/**
 * Title of the square highlight event card. It grows into the card's free space and shows as many
 * whole lines as fit there, without measuring anything in JavaScript: the wrapper takes the free
 * height and the title is laid out against it.
 *
 * Browsers that clamp by height (`line-clamp: auto`) fill that height and end the last line with
 * an ellipsis. The others get a `max-height` rounded down to a whole number of lines, so the text
 * is cut cleanly after the last whole line, without an ellipsis. The rounded height is not used
 * where the clamp is supported, because sub-pixel line heights can make the last line overflow it
 * and be clamped one line early.
 *
 * @param props.title The event name; it may be any length, since the overflow is hidden.
 */
export default function HighlightEventCardTitle({ title }: HighlightEventCardTitleProps) {
  return (
    <Box sx={{ position: "relative", flex: "1 1 0", minHeight: 0, width: "100%" }}>
      <Typography
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          maxHeight: "round(down, 100%, 1lh)",
          overflow: "hidden",
          color: "white",
          fontWeight: 700,
          fontSize: { xs: "0.9rem", sm: "1.05rem" },
          lineHeight: 1.35,
          textAlign: "left",
          textTransform: "none",
          [HEIGHT_LINE_CLAMP_SUPPORTED]: {
            maxHeight: "100%",
            lineClamp: "auto",
          },
        }}
      >
        {title}
      </Typography>
    </Box>
  )
}
