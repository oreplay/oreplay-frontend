import "../../../../../../styles/tokens.css"
import "../../../../../../styles/tailwind.css"
import EventDetailURLButton from "../../../../components/EventDetailURLButton.tsx"
import { formatStageStart } from "../../../../shared/eventDates.ts"
import { parseWebsiteUrl } from "../../../../shared/websiteUrl.ts"
import CalendarIcon from "./components/CalendarIcon.tsx"
import EventStageBannerOrganizer from "./components/EventStageBannerOrganizer.tsx"

interface EventStageBannerProps {
  eventName: string
  stageName: string
  stageStart?: string | null
  organizerName?: string
  countryCode?: string | null
  website?: string | null
  singleStage: boolean
}

const WEBSITE_BUTTON_SX = { minWidth: 0, paddingX: 0.5, paddingY: 0, lineHeight: "inherit" }

export default function EventStageBanner(props: EventStageBannerProps) {
  const title = props.singleStage ? props.eventName : props.stageName
  const subtitle = props.singleStage ? null : props.eventName
  const stageStart = props.stageStart ? formatStageStart(props.stageStart) : null
  const hasWebsite = parseWebsiteUrl(props.website) !== null
  const showSeparator = Boolean(stageStart) && hasWebsite

  return (
    <div className="event-stage-banner tw-root flex flex-col gap-2 bg-[linear-gradient(30deg,#fbe1d7_0%,#ffd4fa_100%)] px-6 py-8 text-left font-sans text-base font-normal leading-normal tracking-[0.00938em]">
      {props.organizerName && (
        <EventStageBannerOrganizer
          organizerName={props.organizerName}
          countryCode={props.countryCode}
        />
      )}
      <p className="m-0 text-[x-large] font-semibold text-black/[0.87]">{title}</p>
      {subtitle && (
        <p className="m-0 whitespace-normal font-semibold break-words text-[normal] text-black/[0.87]">
          {subtitle}
        </p>
      )}
      {(stageStart || hasWebsite) && (
        <div className="flex flex-wrap items-center gap-1.5 text-[small] text-[#646464]">
          {stageStart && (
            <p className="m-0 flex items-center gap-1.5 whitespace-normal break-words">
              <CalendarIcon />
              {stageStart}
            </p>
          )}
          {showSeparator && <span aria-hidden="true">—</span>}
          {hasWebsite && (
            <EventDetailURLButton url={props.website ?? undefined} sx={WEBSITE_BUTTON_SX} />
          )}
        </div>
      )}
    </div>
  )
}
