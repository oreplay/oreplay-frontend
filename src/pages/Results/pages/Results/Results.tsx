import { useParams } from "react-router-dom"
import { useFetchEventDetail } from "../../services/FetchHooks.ts"
import GeneralSuspenseFallback from "../../../../components/GeneralSuspenseFallback.tsx"
import NotFoundPage from "../../../NotFoundError/NotFoundPage.tsx"
import GeneralErrorFallback from "../../../../components/GeneralErrorFallback.tsx"
import { ErrorBoundary } from "react-error-boundary"
import EventStageBanner from "./components/EventStageBanner.tsx"
import StageTypeSelector from "./components/StageTypeSelector.tsx"
import { Suspense } from "react"

export default function Results() {
  // Get url info
  const { eventId, stageId } = useParams<string>()

  // Event's and stage's info
  const { data: eventData, isLoading, isError, error } = useFetchEventDetail(eventId as string)
  const eventDetail = eventData?.data
  const singleStage: boolean = eventDetail?.stages.length == 1
  const stageDetail = eventDetail?.stages.find((stage) => stage.id === stageId)

  // Loading states
  if (isLoading) {
    return <GeneralSuspenseFallback />

    // Error states
  } else if (isError) {
    if (error.response?.status === 403 || error.response?.status === 404) {
      return <NotFoundPage />
    } else {
      return <GeneralErrorFallback displayMsg />
    }

    // Component
  } else {
    if (!eventDetail || !stageDetail) {
      throw new Error("Event or stage info is missing")
    }

    return (
      <Suspense fallback={<GeneralSuspenseFallback />}>
        <ErrorBoundary fallback={<GeneralErrorFallback />}>
          <EventStageBanner
            key={`StageBanner${eventDetail?.id}`}
            eventName={eventDetail?.description as string}
            organizerName={eventDetail?.organizer?.name}
            stageName={stageDetail?.description as string}
            singleStage={singleStage}
          />
          <StageTypeSelector
            key={`StageTypeSelector${eventDetail?.id}`}
            stageType={stageDetail?.stage_type.id}
          />
        </ErrorBoundary>
      </Suspense>
    )
  }
}
