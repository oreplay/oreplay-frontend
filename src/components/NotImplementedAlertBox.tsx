import ConstructionIcon from "@mui/icons-material/Construction"
import { Alert } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function NotImplementedAlertBox() {
  const { t } = useTranslation()

  return (
    <Alert icon={<ConstructionIcon />} severity="info">
      {t("ThisFunctionalityNotImplementedMsg")}
    </Alert>
  )
}
