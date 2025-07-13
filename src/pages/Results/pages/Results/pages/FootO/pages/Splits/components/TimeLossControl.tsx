import { FormControlLabel, Switch, Slider, Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

type TimeLossControlProps = {
  enabled: boolean // Whether the time loss analysis is enabled
  onEnabledChange: (enabled: boolean) => void // Callback to toggle enable state
  threshold: number // Threshold value for the analysis slider (percentage)
  onThresholdChange: (threshold: number) => void // Callback for threshold value changes
  disabled?: boolean // Optional prop to disable the entire control
}

export default function TimeLossControl({
                                          enabled,
                                          onEnabledChange,
                                          threshold,
                                          onThresholdChange,
                                          disabled = false,
                                        }: TimeLossControlProps) {
  const { t } = useTranslation() // Hook for internationalization (i18n)

  // Handler for slider changes, updates threshold value
  const handleThresholdChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    onThresholdChange(newValue as number)
  }

  return (
    // Container box with horizontal layout and spacing
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>

      {/* Switch to enable or disable the time loss analysis */}
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            disabled={disabled}
          />
        }
        label={t("TimeLoss.EnableAnalysis", "Análisis de pérdida de tiempo")}
      />

      {/* Conditional rendering: show slider only if analysis is enabled */}
      {enabled && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 200 }}>
          {/* Label displaying the current threshold percentage */}
          <Typography variant="body2" sx={{ minWidth: 80 }}>
            {t("TimeLoss.Threshold", "Umbral")}: {threshold}%
          </Typography>

          {/* Slider to select the threshold value */}
          <Slider
            value={threshold}
            onChange={handleThresholdChange}
            aria-labelledby="threshold-slider"
            valueLabelDisplay="auto"
            step={5}          // Slider increments by 5%
            marks              // Show marks on the slider
            min={5}            // The minimum threshold is 5%
            max={100}          // The maximum threshold is 100%
            size="small"
            sx={{ width: 120 }}
          />
        </Box>
      )}
    </Box>
  )
}
