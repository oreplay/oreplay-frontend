import { ArrowBack } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"
import { hasInAppHistory } from "../../../../../../../shared/navigationHistory.ts"
import { getStagePath } from "../../../../../shared/eventPath.ts"

interface ControlPunchesBackButtonProps {
  eventId: string
  stageId: string
}

/**
 * Button back to the stage results, for a control page opened directly, as from a shared link or
 * a QR code. After navigating inside the app the header already has a back button, so this one is
 * not shown, and there is only one way back on the screen.
 *
 * @param props.eventId Identifier of the event.
 * @param props.stageId Identifier of the stage.
 */
export default function ControlPunchesBackButton({
  eventId,
  stageId,
}: ControlPunchesBackButtonProps) {
  const { t } = useTranslation()
  const location = useLocation()
  if (hasInAppHistory(location.key)) return null

  return (
    <Tooltip title={t("GoBack")}>
      <IconButton aria-label={t("GoBack")} component={Link} to={getStagePath(eventId, stageId)}>
        <ArrowBack sx={{ color: "text.secondary" }} />
      </IconButton>
    </Tooltip>
  )
}
