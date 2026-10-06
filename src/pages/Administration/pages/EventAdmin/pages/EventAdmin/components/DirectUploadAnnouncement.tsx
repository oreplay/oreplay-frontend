import { Alert, AlertTitle } from "@mui/material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import { useTranslation } from "react-i18next"
import TextWithUploadIcon from "./TextWithUploadIcon.tsx"

export default function DirectUploadAnnouncement() {
  const { t } = useTranslation()

  return (
    <Alert severity="info" icon={<AutoAwesomeIcon fontSize="inherit" />} sx={{ mb: 2 }}>
      <AlertTitle>{t("EventAdmin.DataUpload.newFeature.title")}</AlertTitle>
      <TextWithUploadIcon i18nKey="EventAdmin.DataUpload.newFeature.body" />
    </Alert>
  )
}
