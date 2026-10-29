import { Tooltip } from "@mui/material"
import TaskAltIcon from "@mui/icons-material/TaskAlt"
import { useTranslation } from "react-i18next"

const DEFAULT_ICON_SIZE_PX = 16
const TOUCH_TOOLTIP_VISIBLE_MS = 3000

interface StageEndedIconProps {
  sizePx?: number
}

export default function StageEndedIcon({ sizePx = DEFAULT_ICON_SIZE_PX }: StageEndedIconProps) {
  const { t } = useTranslation()
  const label = t("common:finished")

  return (
    <Tooltip title={label} enterTouchDelay={0} leaveTouchDelay={TOUCH_TOOLTIP_VISIBLE_MS}>
      <TaskAltIcon
        role="img"
        aria-label={label}
        aria-hidden={false}
        color="success"
        sx={{ fontSize: sizePx, flexShrink: 0, opacity: 0.85 }}
      />
    </Tooltip>
  )
}
