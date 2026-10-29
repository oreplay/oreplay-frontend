import { Alert } from "@mui/material"
import { useTranslation } from "react-i18next"

/**
 * Full-width warning on its own line at the top of the results, shown while the page keeps data
 * from an earlier load because the latest refresh failed. It goes away by itself once a refresh
 * succeeds.
 */
export default function OutdatedDataMsg() {
  const { t } = useTranslation()

  return (
    <Alert severity="warning" sx={{ borderRadius: 0 }}>
      {t("ResultsStage.OutdatedData")}
    </Alert>
  )
}
