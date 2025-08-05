import { useTranslation } from "react-i18next"
import { Alert } from "@mui/material"
import ScienceIcon from "@mui/icons-material/Science"

export default function RadiosExperimentalAlert() {
  const { t } = useTranslation()

  return (
    <Alert severity="info" icon={<ScienceIcon />} sx={{ marginBottom: "1em" }}>
      {t("RadiosExperimentalMsg")}
    </Alert>
  )
}
