import "../../../../../../styles/tokens.css"
import "../../../../../../styles/tailwind.css"
import EventDetailURLButton from "../../../../components/EventDetailURLButton.tsx"
import { formatStageStart } from "../../../../shared/eventDates.ts"
import { parseWebsiteUrl } from "../../../../shared/websiteUrl.ts"
import CalendarIcon from "./components/CalendarIcon.tsx"
import EventStageBannerOfficial from "./components/EventStageBannerOfficial.tsx"
import EventStageBannerOrganizer from "./components/EventStageBannerOrganizer.tsx"
import EventStageBannerSubtitle from "./components/EventStageBannerSubtitle.tsx"
import EventStageBannerWatermark from "./components/EventStageBannerWatermark.tsx"

interface EventStageBannerProps {
  eventName: string
  stageName: string
  stageStart?: string | null
  organizerName?: string
  countryCode?: string | null
  website?: string | null
  singleStage: boolean
  isOfficial?: boolean
  subtitleTo?: string
}

const WEBSITE_BUTTON_SX = { minWidth: 0, paddingX: 0.5, paddingY: 0, lineHeight: "inherit" }

/**
 * Header of a stage's results page: organizer, title, the event as a subtitle on multi-stage events,
 * start time and website, plus an "Official" chip in the bottom-right corner once the stage is
 * finished.
 * @param props.eventName Event name; the title on single-stage events, the subtitle otherwise.
 * @param props.stageName Stage name, the title on multi-stage events.
 * @param props.stageStart Stage start as an ISO date-time; omitted when null or absent.
 * @param props.organizerName Organizer shown above the title, when known.
 * @param props.countryCode Organizer's country, for its flag.
 * @param props.website Event website; the link is hidden when missing or not a valid URL.
 * @param props.singleStage Whether the event has only one stage.
 * @param props.isOfficial Whether the organizer finished the stage, making its results official.
 * Absent means not official.
 * @param props.subtitleTo Where the subtitle links to, usually the event page.
 */
export default function EventStageBanner(props: EventStageBannerProps) {
  const title = props.singleStage ? props.eventName : props.stageName
  const subtitle = props.singleStage ? null : props.eventName
  const stageStart = props.stageStart ? formatStageStart(props.stageStart) : null
  const hasWebsite = parseWebsiteUrl(props.website) !== null
  const showSeparator = Boolean(stageStart) && hasWebsite

  return (
    <div className="event-stage-banner tw-root relative isolate flex flex-col gap-2 overflow-hidden bg-white px-6 py-8 text-left font-sans text-base font-normal leading-normal tracking-[0.00938em]">
      <EventStageBannerWatermark />
      {props.organizerName && (
        <EventStageBannerOrganizer
          organizerName={props.organizerName}
          countryCode={props.countryCode}
        />
      )}
      <p className="m-0 text-[x-large] font-semibold text-black/[0.87]">{title}</p>
      {subtitle && <EventStageBannerSubtitle text={subtitle} to={props.subtitleTo} />}
      {(stageStart || hasWebsite) && (
        <div className="flex flex-col items-start gap-1.5 text-[small] text-[#646464] sm:flex-row sm:flex-wrap sm:items-center">
          {stageStart && (
            <p className="m-0 flex items-center gap-1.5 whitespace-normal break-words">
              <CalendarIcon />
              {stageStart}
            </p>
          )}
          {showSeparator && (
            <span aria-hidden="true" className="hidden sm:inline">
              —
            </span>
          )}
          {hasWebsite && (
            <EventDetailURLButton url={props.website ?? undefined} sx={WEBSITE_BUTTON_SX} />
          )}
        </div>
      )}
      {props.isOfficial && <EventStageBannerOfficial />}
    </div>
  )
}
