import { Alert } from "@mui/material"
import { useTranslation } from "react-i18next"

/**
 * Tells the user that the results uploaded to a totals stage do not come from a totals stage, so
 * they cannot be shown until the organizer uploads the right data.
 */
export default function NonTotalsDataMsg() {
  const { t } = useTranslation()

  return (
    <Alert severity="error" variant="outlined" sx={{ margin: 2 }}>
      {t("ResultsStage.Totals.NonTotalsData")}
    </Alert>
  )
}
