import { Box, Slider, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import {
  MAX_TIME_LOSS_THRESHOLD,
  MIN_TIME_LOSS_THRESHOLD,
  TIME_LOSS_THRESHOLD_STEP,
} from "../shared/timeLossThreshold.ts"

interface TimeLossThresholdSliderProps {
  onChange: (threshold: number) => void
  threshold: number
}

export default function TimeLossThresholdSlider({
  onChange,
  threshold,
}: TimeLossThresholdSliderProps) {
  const { t } = useTranslation()

  return (
    <Box sx={{ px: "16px", pb: "16px", display: "flex", alignItems: "center", gap: 2 }}>
      <Typography sx={{ whiteSpace: "nowrap" }}>
        {t("Graphs.ThresholdWithPercent", { percent: threshold })}
      </Typography>
      <Slider
        size="small"
        value={threshold}
        min={MIN_TIME_LOSS_THRESHOLD}
        max={MAX_TIME_LOSS_THRESHOLD}
        step={TIME_LOSS_THRESHOLD_STEP}
        marks
        onChange={(_, newThreshold) => {
          if (typeof newThreshold === "number") onChange(newThreshold)
        }}
        sx={{ flexGrow: 1, maxWidth: 300 }}
      />
    </Box>
  )
}
