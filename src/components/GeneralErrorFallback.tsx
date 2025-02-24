import { useTranslation } from "react-i18next"
import { Alert, AlertTitle } from "@mui/material"

type GeneralErrorFallbackProps = {
  displayMsg?: boolean
}

export default function GeneralErrorFallback(props: GeneralErrorFallbackProps) {
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
      <AlertTitle>{t("GeneralErrorFallback.title")}</AlertTitle>
      {props.displayMsg ? t("GeneralErrorFallback.msg") : ""}
    </Alert>
  )
}
