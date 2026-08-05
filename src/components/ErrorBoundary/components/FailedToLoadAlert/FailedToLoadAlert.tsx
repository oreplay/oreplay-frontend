import { useTranslation } from "react-i18next"
import { Alert, AlertTitle } from "@mui/material"

export default function FailedToLoadAlert() {
  const { t } = useTranslation()

  return (
    <Alert
      severity="error"
      sx={{
        height: "100%",
        margin: 2,
      }}
      variant={"outlined"}
    >
      <AlertTitle>{t("FailedToLoad.title")}</AlertTitle>
      {t("FailedToLoad.msg")}
    </Alert>
  )
}
