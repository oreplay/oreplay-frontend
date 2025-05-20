import { useTranslation } from "react-i18next"
import { Alert, AlertTitle } from "@mui/material"

export default function OnlyForClassesMsg() {
  const { t } = useTranslation()

  return (
    <Alert severity={"info"}>
      <AlertTitle>{t("ResultsStage.SplitsTable.OnlyForClasses")}</AlertTitle>
    </Alert>
  )
}
