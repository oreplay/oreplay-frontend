import { useQuery, UseQueryOptions } from "react-query"
import { AxiosError } from "axios"
import { Data, EventDetailModel, StageModel } from "../../../shared/EntityTypes.ts"
import { getEventDetail } from "./EventService.ts"
import { useAuth } from "../../../shared/hooks.ts"

interface EmptyModel {}

//export function useGet<T,D>(function) {
//  return useQuery<T, D>({})
//}

export function genericRetryHandler(failureCount: number, error: AxiosError): boolean {
  if (error.response && error.response.status < 500) {
    return false
  }
  return failureCount < 3
}

export function useFetchEventDetail(
  id: string,
  options?: UseQueryOptions<Data<EventDetailModel>, AxiosError<Data<EventDetailModel>, EmptyModel>>,
) {
  const { token } = useAuth()

  return useQuery<Data<EventDetailModel>, AxiosError<Data<EventDetailModel>, EmptyModel>>(
    ["eventDetail", id], // Query key
    () => getEventDetail(id, token ? token : undefined), // Query function
    {
      enabled: !!id, // Only fetch if id exists
      refetchOnWindowFocus: false,
      retry: genericRetryHandler,
      ...options,
    },
  )
}

interface StageDetailHookResult {
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  data?: StageModel
  error?: string
}

export function useFetchStageDetail(
  eventId: string,
  stageId: string,
  options?: UseQueryOptions<Data<EventDetailModel>, AxiosError<Data<EventDetailModel>, EmptyModel>>,
): StageDetailHookResult {
  const {
    isLoading,
    isError: queryIsError,
    isSuccess,
    data,
    error: queryError,
  } = useFetchEventDetail(eventId, options)

  let stageDetail: StageModel | undefined = undefined
  let error: string | undefined = undefined
  let isError = queryIsError

  if (isSuccess) {
    stageDetail = data?.data.stages.find((stage) => stage.id === stageId)

    if (!stageDetail) {
      isError = true
      error = "This stage does not belong to this event"
    }
  } else if (queryIsError) {
    error = queryError instanceof Error ? queryError.message : String(queryError)
  }

  return { isLoading, isError, isSuccess, data: stageDetail, error }
}
