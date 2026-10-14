import { DialogContentText } from "@mui/material"
import { useTranslation } from "react-i18next"

/**
 * Explains which sites the Trail-O results URL may point to and how to remove it.
 */
export default function TrailOResultsUrlHelp() {
  const { t } = useTranslation()

  return (
    <DialogContentText sx={{ marginBottom: 2 }}>
      {t("EventAdmin.Stages.TrailOResultsUrl.DialogBody")}
    </DialogContentText>
  )
}
