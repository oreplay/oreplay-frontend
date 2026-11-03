import { Alert } from "@mui/material"
import { useTranslation } from "react-i18next"

/** Explains that this browser cannot listen to a folder and what to use instead. */
export default function FolderListenUnsupported() {
  const { t } = useTranslation()

  return (
    <Alert severity="warning" data-testid="folder-listen-unsupported">
      {t("EventAdmin.DataUpload.listen.unsupported")}
    </Alert>
  )
}
