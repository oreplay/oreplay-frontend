import { Box } from "@mui/material"
import StageEndedIcon from "../../../../components/StageEndedIcon.tsx"

const BADGE_ICON_SIZE_PX = 20

export default function StageEndedBadge() {
  return (
    <Box
      component="span"
      onClick={(event) => event.stopPropagation()}
      sx={{
        position: "absolute",
        top: "-9px",
        left: "-9px",
        display: "flex",
        padding: "2px",
        borderRadius: "50%",
        backgroundColor: "background.paper",
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.12)",
        cursor: "default",
      }}
    >
      <StageEndedIcon sizePx={BADGE_ICON_SIZE_PX} />
    </Box>
  )
}
