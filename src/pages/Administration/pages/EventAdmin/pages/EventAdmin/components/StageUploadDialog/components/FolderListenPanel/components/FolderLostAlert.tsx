import { Alert } from "@mui/material"
import { useTranslation } from "react-i18next"

/** Tells the user that the folder could not be read and listening stopped. */
export default function FolderLostAlert() {
  const { t } = useTranslation()

  return (
    <Alert severity="error" data-testid="folder-listen-lost" sx={{ flexShrink: 0 }}>
      {t("EventAdmin.DataUpload.listen.folderLost")}
    </Alert>
  )
}
