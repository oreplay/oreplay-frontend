import { useParams } from "react-router-dom"
import { useFetchEventDetail } from "../../services/FetchHooks.ts"
import GeneralSuspenseFallback from "../../../../components/GeneralSuspenseFallback.tsx"
import NotFoundPage from "../../../NotFoundPage/NotFoundPage.tsx"
import GeneralErrorFallback from "../../../../components/GeneralErrorFallback.tsx"
import EventStageBanner from "./components/EventStageBanner/EventStageBanner.tsx"
import StageTypeSelector from "./components/StageTypeSelector.tsx"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { RESULTS_QUERY, STAGE_TYPE_DATABASE_ID } from "./shared/constants.ts"
import PrivateEventPage from "../../../PrivateEventError/PrivateEventError.tsx"
import ErrorBoundary from "../../../../components/ErrorBoundary/ErrorBoundary.tsx"
import { useQuery } from "react-query"
import { getClassesInStage } from "../../services/EventService.ts"
import NoDataInStageMsg from "./components/NoDataInStageMsg.tsx"
import { getEventPath } from "../../shared/eventPath.ts"
import "../../../../styles/tailwind.css"
import TrailO from "./pages/TrailO/TrailO.tsx"
import { isTrailOStage } from "./shared/stageTypes.ts"
import { isStageEnded } from "../../../shared/isStageEnded.ts"
import OutdatedDataMsg from "./components/OutdatedDataMsg.tsx"
import { useOutdatedDataError } from "./shared/useOutdatedDataError.ts"
import { useNotifyOutdatedData } from "./shared/useNotifyOutdatedData.ts"
import { getStageLastUpdate } from "./shared/stageLastUpdate.ts"

export default function Results() {
  const { t } = useTranslation()

  // Get url info
  const { eventId, stageId } = useParams<string>()

  // Event's and stage's info
  const {
    data: eventData,
    isLoading,
    isError,
    error,
  } = useFetchEventDetail(eventId as string, RESULTS_QUERY)
  const eventDetail = eventData?.data
  const failedWithoutData = isError && !eventDetail
  const outdatedDataError = useOutdatedDataError()
  const isOutdated = outdatedDataError !== undefined
  useNotifyOutdatedData(isOutdated, outdatedDataError)
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
  }

  // Error states
  if (failedWithoutData) {
    if (error.response?.status === 404) {
      return <NotFoundPage />
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      return <PrivateEventPage />
    }
    return <GeneralErrorFallback displayMsg />
  }
  if (classesQuery.isError) {
    return <GeneralErrorFallback displayMsg />
  }

  // Non-existing stage
  if (!eventDetail || !stageDetail) {
    return <NotFoundPage />
  }

  const isTrailO = isTrailOStage(stageDetail.stage_type.id)
  const hasClasses = classesQuery.isSuccess && classesQuery.data.data.length > 0

  // Component
  return (
    <Suspense fallback={<GeneralSuspenseFallback />}>
      <ErrorBoundary>
        {isOutdated && <OutdatedDataMsg />}
        <EventStageBanner
          key={`StageBanner${eventDetail.id}`}
          eventName={eventDetail.description}
          organizerName={eventDetail.organizer?.name}
          countryCode={eventDetail.country_code}
          website={eventDetail.website}
          stageName={
            stageDetail.stage_type.id !== STAGE_TYPE_DATABASE_ID.Totals
              ? stageDetail.description
              : t("EventAdmin.Stages.StagesTypes.Totals.title")
          }
          stageStart={stageDetail.start}
          singleStage={singleStage}
          isOfficial={isStageEnded(stageDetail)}
          lastUpdate={getStageLastUpdate(stageDetail)}
          subtitleTo={getEventPath(eventDetail.id)}
        />
        {isTrailO && <TrailO externalUrl={stageDetail.external_url} />}
        {!isTrailO && hasClasses && (
          <StageTypeSelector
            key={`StageTypeSelector${eventDetail?.id}`}
            stageType={stageDetail?.stage_type.id}
          />
        )}
        {!isTrailO && !hasClasses && <NoDataInStageMsg />}
      </ErrorBoundary>
    </Suspense>
  )
}
