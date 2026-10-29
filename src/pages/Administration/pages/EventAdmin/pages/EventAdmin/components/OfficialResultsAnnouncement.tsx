import { Alert, AlertTitle } from "@mui/material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import SettingsIcon from "@mui/icons-material/Settings"
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"
import { Trans, useTranslation } from "react-i18next"
import InlineMenuIcon from "./InlineMenuIcon.tsx"

/**
 * Announces to organizers that a stage's results can now be made official from its settings menu,
 * with the same look as the direct XML upload announcement.
 */
export default function OfficialResultsAnnouncement() {
  const { t } = useTranslation("announcements")

  return (
    <Alert severity="info" icon={<AutoAwesomeIcon fontSize="inherit" />} sx={{ mb: 2 }}>
      <AlertTitle>{t("officialResults.title")}</AlertTitle>
      <Trans
        t={t}
        i18nKey="officialResults.body"
        components={{
          settingsIcon: <InlineMenuIcon Icon={SettingsIcon} />,
          officialIcon: <InlineMenuIcon Icon={VerifiedOutlinedIcon} />,
        }}
      />
    </Alert>
  )
}
