import { SettingsRemote as SettingsRemoteIcon } from "@mui/icons-material"
import { useTranslation } from "react-i18next"

interface OnlineCourseToggleProps {
  isActive: boolean
  onToggle: () => void
}

/**
 * Icon button that shows or hides the online course of the result rows. Its icon is orange while
 * the online course is shown and grey while it is hidden, and a tooltip names what a click does.
 * The icon must stay the same as `RadiosIcon`, the one of the radio controls view in the splits
 * toolbar, which shows the same online controls there: change both together.
 *
 * @param props.isActive Whether the online course is shown now.
 * @param props.onToggle Called when the user asks to switch it.
 */
export default function OnlineCourseToggle({ isActive, onToggle }: OnlineCourseToggleProps) {
  const { t } = useTranslation()
  const label = isActive ? t("ResultsStage.OnlineCourse.Hide") : t("ResultsStage.OnlineCourse.Show")
  const iconColorClassName = isActive ? "text-primary" : "text-neutral-400"

  return (
    <span className="group relative inline-flex">
      <button
        aria-label={label}
        aria-pressed={isActive}
        onClick={onToggle}
        type="button"
        className="inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-2 transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <SettingsRemoteIcon className={iconColorClassName} />
      </button>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded bg-neutral-600/90 px-2 py-1 text-[11px] font-medium leading-normal text-white opacity-0 transition-opacity group-has-[:focus-visible]:opacity-100 [@media(hover:hover)]:group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}
