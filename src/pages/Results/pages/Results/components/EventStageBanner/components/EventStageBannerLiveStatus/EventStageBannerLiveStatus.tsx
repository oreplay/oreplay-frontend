import { DateTime } from "luxon"
import NowProvider from "../../../NowProvider.tsx"
import LiveStatusIcon from "./components/LiveStatusIcon.tsx"

interface EventStageBannerLiveStatusProps {
  lastUpdate: DateTime
  stageStart?: string | null
}

/**
 * Live status icon in the top-right corner of the event stage banner, inside its padding so it
 * lines up with the banner's content edges. It keeps the current time ticking, so the icon appears on
 * its own once the stage starts and turns offline on its own once uploads stop. The banner has to be positioned for the corner to be its
 * own.
 * @param props.lastUpdate Moment of the stage's latest upload.
 * @param props.stageStart Stage start as an ISO date-time; the icon is hidden until it is reached.
 * Null or absent when unknown, which shows the icon.
 */
export default function EventStageBannerLiveStatus({
  lastUpdate,
  stageStart,
}: EventStageBannerLiveStatusProps) {
  return (
    <div className="event-stage-banner-live-status absolute right-6 top-8 flex">
      <NowProvider>
        <LiveStatusIcon lastUpdate={lastUpdate} stageStart={stageStart} />
      </NowProvider>
    </div>
  )
}
