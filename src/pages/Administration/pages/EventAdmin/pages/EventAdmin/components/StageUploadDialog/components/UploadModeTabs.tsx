import { SyntheticEvent } from "react"
import { Tab, Tabs } from "@mui/material"
import { useTranslation } from "react-i18next"
import { modeLabelKeyOf, UPLOAD_MODES, UploadMode } from "../shared/uploadMode.ts"

interface UploadModeTabsProps {
  isLocked: boolean
  mode: UploadMode
  onChange: (mode: UploadMode) => void
}

/**
 * Switches between uploading picked files and listening to a folder.
 * @param props.isLocked disables switching while data is being sent.
 * @param props.mode the mode shown.
 * @param props.onChange called with the mode the user picks.
 */
export default function UploadModeTabs({ isLocked, mode, onChange }: UploadModeTabsProps) {
  const { t } = useTranslation()

  /**
   * Forwards the tab the user picks.
   * @param _event the click on the tab.
   * @param picked the value of the picked tab.
   */
  const handleChange = (_event: SyntheticEvent, picked: UploadMode) => onChange(picked)

  return (
    <Tabs
      value={mode}
      onChange={handleChange}
      variant="fullWidth"
      sx={{ borderBottom: 1, borderColor: "divider", flexShrink: 0 }}
    >
      {UPLOAD_MODES.map((tabMode) => (
        <Tab
          key={tabMode}
          value={tabMode}
          label={t(modeLabelKeyOf(tabMode))}
          disabled={isLocked && tabMode !== mode}
          data-testid={`upload-mode-${tabMode}`}
        />
      ))}
    </Tabs>
  )
}
