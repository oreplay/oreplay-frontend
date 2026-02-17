import { useParams } from "react-router-dom"
import { useFetchEventDetail } from "../../services/FetchHooks.ts"
import GeneralSuspenseFallback from "../../../../components/GeneralSuspenseFallback.tsx"
import NotFoundPage from "../../../NotFoundError/NotFoundPage.tsx"
import GeneralErrorFallback from "../../../../components/GeneralErrorFallback.tsx"
import { ErrorBoundary } from "@sentry/react"
import EventStageBanner from "./components/EventStageBanner.tsx"
import StageTypeSelector from "./components/StageTypeSelector.tsx"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { STAGE_TYPE_DATABASE_ID } from "./shared/constants.ts"
import PrivateEventPage from "../../../PrivateEventError"
import { useQuery } from "react-query"
import { getClassesInStage } from "../../services/EventService.ts"
import NoDataInStageMsg from "./components/NoDataInStageMsg.tsx"

export default function Results() {
  const { t } = useTranslation()

  // Get url info
  const { eventId, stageId } = useParams<string>()

  // Event's and stage's info
  const { data: eventData, isLoading, isError, error } = useFetchEventDetail(eventId as string)
  const eventDetail = eventData?.data
  const singleStage: boolean = eventDetail?.stages.length == 1
  const stageDetail = eventDetail?.stages.find((stage) => stage.id === stageId)

  // Has the stage data uploaded? Check if classes are created
  const classesQuery = useQuery(
    ["classes", stageId, eventId],
    () => getClassesInStage(eventId as string, stageId as string),
    {
      refetchOnWindowFocus: false,
    },
  )

  // Loading states
  if (isLoading || classesQuery.isLoading) {
    return <GeneralSuspenseFallback />

    // Error states
  } else if (isError) {
    if (error.response?.status === 404) {
      return <NotFoundPage />
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      return <PrivateEventPage />
    }
    return <GeneralErrorFallback displayMsg />
  } else if (classesQuery.isError) {
    return <GeneralErrorFallback displayMsg />

    // Component
  } else {
    if (!eventDetail || !stageDetail) {
      throw new Error("Event or stage info is missing")
    }

    return (
      <Suspense fallback={<GeneralSuspenseFallback />}>
        <ErrorBoundary fallback={<GeneralErrorFallback />}>
          <EventStageBanner
            key={`StageBanner${eventDetail.id}`}
            eventName={eventDetail.description}
            organizerName={eventDetail.organizer?.name}
            stageName={
              stageDetail.stage_type.id !== STAGE_TYPE_DATABASE_ID.Totals
                ? stageDetail.description
                : t("EventAdmin.Stages.StagesTypes.Totals.title")
            }
            singleStage={singleStage}
          />
          {classesQuery.isSuccess && classesQuery.data.data.length > 0 ? (
            <StageTypeSelector // display stage data
              key={`StageTypeSelector${eventDetail?.id}`}
              stageType={stageDetail?.stage_type.id}
            />
          ) : (
            // No classes created: no data available
            <NoDataInStageMsg />
          )}
        </ErrorBoundary>
      </Suspense>
    )
  }
}
