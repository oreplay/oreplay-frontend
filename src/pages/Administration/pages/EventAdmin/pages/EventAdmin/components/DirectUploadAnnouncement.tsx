import { Alert, AlertTitle } from "@mui/material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { Trans, useTranslation } from "react-i18next"
import InlineMenuIcon from "./InlineMenuIcon.tsx"

/**
 * Announces to organizers that start lists and results can be uploaded as XML straight from the
 * event admin page, pointing at the upload button of each stage.
 */
export default function DirectUploadAnnouncement() {
  const { t } = useTranslation("announcements")

  return (
    <Alert severity="info" icon={<AutoAwesomeIcon fontSize="inherit" />} sx={{ mb: 2 }}>
      <AlertTitle>{t("directUpload.title")}</AlertTitle>
      <Trans
        t={t}
        i18nKey="directUpload.body"
        components={{ uploadIcon: <InlineMenuIcon Icon={UploadFileIcon} /> }}
      />
    </Alert>
  )
}
