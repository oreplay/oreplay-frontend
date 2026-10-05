import { Box, Slide, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { CONNECTION_BAR_APPEARANCE, ConnectionBarState } from "../shared/connectionBar.ts"

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
          paddingY: 0.5,
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
