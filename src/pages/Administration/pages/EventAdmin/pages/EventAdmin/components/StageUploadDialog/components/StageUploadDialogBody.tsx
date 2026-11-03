import { ReactNode } from "react"
import { DialogContent, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { UploadMode } from "../shared/uploadMode.ts"
import UploadModeTabs from "./UploadModeTabs.tsx"
import ExperimentalFeatureAlert from "../../../../../../../../../components/ExperimentalFeatureAlert.tsx"

interface StageUploadDialogBodyProps {
  children: ReactNode
  isModeLocked: boolean
  mode: UploadMode
  onModeChange: (mode: UploadMode) => void
}

/**
 * Lays out the upload dialog's content: the explanation, the mode tabs and the active mode.
 * @param props.children the panel of the active mode.
 * @param props.isModeLocked disables switching mode while data is being sent.
 * @param props.mode the active mode.
 * @param props.onModeChange called with the mode the user picks.
 */
export default function StageUploadDialogBody({
  children,
  isModeLocked,
  mode,
  onModeChange,
}: StageUploadDialogBodyProps) {
  const { t } = useTranslation()

  return (
    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography component="p" variant="body2" color="text.secondary">
        {t("EventAdmin.DataUpload.uploadFilesDescription")}
      </Typography>
      <ExperimentalFeatureAlert />
      <UploadModeTabs isLocked={isModeLocked} mode={mode} onChange={onModeChange} />
      {children}
    </DialogContent>
  )
}
