import RefreshIcon from "@mui/icons-material/Refresh"
import { useTranslation } from "react-i18next"
import { indicatorOffset, pullProgress } from "../shared/pullGesture.ts"

const FULL_TURN_DEG = 360

interface PullToRefetchIndicatorProps {
  distance: number
  isPulling: boolean
  isRefreshing: boolean
}

/**
 * The round refresh icon revealed above the content as it is pulled down: it fades in and turns
 * with the pull, then spins while the refresh runs, announcing it to screen readers.
 * @param props.distance - The content's current downward offset, in px.
 * @param props.isPulling - Whether a finger is dragging, which disables the easing so the icon
 * follows it without lag.
 * @param props.isRefreshing - Whether the refresh is in progress.
 */
export default function PullToRefetchIndicator({
  distance,
  isPulling,
  isRefreshing,
}: PullToRefetchIndicatorProps) {
  const { t } = useTranslation()
  const progress = pullProgress(distance)
  const easing = isPulling ? "" : "transition-[opacity,transform] duration-300 ease-out"
  const rotation = isRefreshing ? "animate-spin" : ""
  const positionStyle = {
    opacity: isRefreshing ? 1 : progress,
    transform: `translateY(${indicatorOffset(distance)}px)`,
  }
  const rotationStyle = isRefreshing ? undefined : { rotate: `${progress * FULL_TURN_DEG}deg` }

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 flex justify-center ${easing}`}
      style={positionStyle}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#555] shadow-md ${rotation}`}
        style={rotationStyle}
        aria-hidden
      >
        <RefreshIcon fontSize="small" />
      </div>
      {isRefreshing && (
        <span role="status" className="sr-only">
          {t("common:loading")}
        </span>
      )}
    </div>
  )
}
