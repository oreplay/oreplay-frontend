import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

interface RelayLegSelectorProps {
  legNumbers: number[]
  onSelect: (legNumber: number) => void
  selectedLegNumber: number
}

/**
 * Buttons to pick which leg of the relay is listed, one per leg. The selected leg cannot be
 * unselected, so a leg is always shown.
 *
 * @param props.legNumbers Numbers of the legs, from 1.
 * @param props.onSelect Called with the number of the leg picked.
 * @param props.selectedLegNumber Number of the leg listed now.
 */
export default function RelayLegSelector({
  legNumbers,
  onSelect,
  selectedLegNumber,
}: RelayLegSelectorProps) {
  const { t } = useTranslation()

  /**
   * Forwards the picked leg, ignoring a click on the leg already selected.
   *
   * @param _event The click on the button.
   * @param legNumber Number of the leg picked, or `null` when the selected one is clicked again.
   */
  const handleChange = (_event: MouseEvent<HTMLElement>, legNumber: number | null) => {
    if (legNumber !== null) onSelect(legNumber)
  }

  return (
    <ToggleButtonGroup
      aria-label={t("StageHeader.RelayLegs")}
      color="primary"
      exclusive
      fullWidth
      onChange={handleChange}
      size="small"
      sx={{ paddingX: 1, paddingY: 1 }}
      value={selectedLegNumber}
    >
      {legNumbers.map((legNumber) => (
        <ToggleButton key={legNumber} value={legNumber}>
          {t("ResultsStage.Relay.Leg", { leg: legNumber })}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
