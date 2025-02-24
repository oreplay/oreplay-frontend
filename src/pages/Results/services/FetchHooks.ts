import { useQuery } from "react-query"
import { AxiosError } from "axios"
import { Data, EventDetailModel } from "../../../shared/EntityTypes.ts"
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

export function useFetchEventDetail(id: string) {
  const { token } = useAuth()

  return useQuery<Data<EventDetailModel>, AxiosError<Data<EventDetailModel>, EmptyModel>>(
    ["eventDetail", id], // Query key
    () => getEventDetail(id, token ? token : undefined), // Query function
    {
      enabled: !!id, // Only fetch if id exists
      refetchOnWindowFocus: false,
      retry: genericRetryHandler,
    },
  )
}
