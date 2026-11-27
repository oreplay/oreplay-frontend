import { KeyboardEvent, MouseEvent, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Link, useParams } from "react-router-dom"
import { getControlPath } from "../../../../../../../../../../../shared/eventPath.ts"
import { SYMBOL_CENTER_Y_PX } from "../../../../../shared/onlineCourse/onlineCourseGeometry.ts"

const TOUCH_TARGET_RADIUS_PX = 22

const LINK_CLASS_NAME = "cursor-pointer outline-none focus-visible:opacity-70 hover:opacity-70"

interface OnlineCourseControlLinkProps {
  children: ReactNode
  station: string | null
}

/**
 * Keeps a click or a key press on the link from reaching the result row, so it opens the control
 * page and not the runner's ticket.
 *
 * @param event The click or key press on the link.
 */
function keepFromRow(event: MouseEvent | KeyboardEvent) {
  event.stopPropagation()
}

/**
 * Makes an online control of the course a link to the page of that control, with a touch target
 * larger than the drawn circle. Outside a stage, or for a control without a code, the control is
 * drawn as it is.
 *
 * @param props.children The control as drawn: its symbol and times.
 * @param props.station Code of the control, or `null` when unknown.
 */
export default function OnlineCourseControlLink({
  children,
  station,
}: OnlineCourseControlLinkProps) {
  const { t } = useTranslation()
  const { eventId, stageId } = useParams()
  if (!eventId || !stageId || !station) return children

  const label = t("ResultsStage.OnlineCourse.OpenControl", { station })

  return (
    <Link
      aria-label={label}
      className={LINK_CLASS_NAME}
      onClick={keepFromRow}
      onKeyDown={keepFromRow}
      to={getControlPath(eventId, stageId, station)}
    >
      <title>{label}</title>
      <circle cy={SYMBOL_CENTER_Y_PX} fill="transparent" r={TOUCH_TARGET_RADIUS_PX} />
      {children}
    </Link>
  )
}
