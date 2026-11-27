import { useParams } from "react-router-dom"
import GeneralErrorFallback from "../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../components/GeneralSuspenseFallback.tsx"
import NotFoundPage from "../../../../../NotFoundPage/NotFoundPage.tsx"
import { useFetchEventDetail } from "../../../../services/FetchHooks.ts"
import { getEventPath } from "../../../../shared/eventPath.ts"
import EventStageBanner from "../../components/EventStageBanner/EventStageBanner.tsx"
import ControlPunchesContent from "./components/ControlPunchesContent.tsx"
import "../../../../../../styles/tailwind.css"

const EVENT_DETAIL_STALE_MILLISECONDS = 15000

/**
 * Live list of who punches a control of a stage, for someone standing at that control during the
 * race. It shares the stage's banner and the results list's look.
 */
export default function ControlPunches() {
  const { eventId, stageId, station } = useParams<string>()
  const eventQuery = useFetchEventDetail(eventId as string, {
    staleTime: EVENT_DETAIL_STALE_MILLISECONDS,
  })
  const eventDetail = eventQuery.data?.data
  const stageDetail = eventDetail?.stages.find((stage) => stage.id === stageId)
  const stationNumber = Number(station)

  if (eventQuery.isLoading) {
    return <GeneralSuspenseFallback />
  }
  if (eventQuery.isError) {
    return <GeneralErrorFallback displayMsg />
  }
  if (!eventDetail || !stageDetail || !Number.isInteger(stationNumber)) {
    return <NotFoundPage />
  }

  return (
    <>
      <EventStageBanner
        eventName={eventDetail.description}
        organizerName={eventDetail.organizer?.name}
        countryCode={eventDetail.country_code}
        website={eventDetail.website}
        stageName={stageDetail.description}
        stageStart={stageDetail.start}
        singleStage={eventDetail.stages.length === 1}
        subtitleTo={getEventPath(eventDetail.id)}
      />
      <ControlPunchesContent
        eventId={eventDetail.id}
        stageId={stageDetail.id}
        station={stationNumber}
      />
    </>
  )
}
