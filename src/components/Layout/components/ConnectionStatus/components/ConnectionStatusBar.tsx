import { Box, Slide, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { CONNECTION_BAR_APPEARANCE, ConnectionBarState } from "../shared/connectionBar.ts"
import { offsetFromSafeArea, SAFE_AREA_BOTTOM_BAR_INSET } from "../../../../../shared/safeArea.ts"

const VERTICAL_PADDING_PX = 4

interface ConnectionStatusBarProps {
  bar: ConnectionBarState
}

export default function ConnectionStatusBar({ bar }: ConnectionStatusBarProps) {
  const { t } = useTranslation()
  const { backgroundColor, labelKey } = CONNECTION_BAR_APPEARANCE[bar.kind]

  return (
    <Slide direction="up" in={bar.isVisible} mountOnEnter unmountOnExit>
      <Box
        role="status"
        aria-live="polite"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.snackbar,
          paddingTop: `${VERTICAL_PADDING_PX}px`,
          paddingBottom: offsetFromSafeArea(SAFE_AREA_BOTTOM_BAR_INSET, VERTICAL_PADDING_PX),
          textAlign: "center",
          color: "common.white",
          backgroundColor,
          transition: (theme) => theme.transitions.create("background-color"),
        }}
      >
        <Typography variant="body2">{t(labelKey)}</Typography>
      </Box>
    </Slide>
  )
}
