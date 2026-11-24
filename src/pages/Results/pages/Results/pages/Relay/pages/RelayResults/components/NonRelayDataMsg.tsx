import { Alert } from "@mui/material"
import { useTranslation } from "react-i18next"

/**
 * Tells the user that the results uploaded to a relay stage do not come from a relay, so they
 * cannot be shown until the organizer uploads the right data.
 */
export default function NonRelayDataMsg() {
  const { t } = useTranslation()

  return (
    <Alert severity="error" variant="outlined" sx={{ margin: 2 }}>
      {t("ResultsStage.Relay.NonRelayData")}
    </Alert>
  )
}
