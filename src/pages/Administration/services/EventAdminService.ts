import { DateTime } from "luxon"
import {
  Data,
  EventModel,
  GetEventTokenResponse,
  Page,
  PostEventResponse,
  PostEventTokenResponse,
  PostStageResponse,
  OrganizerModel,
} from "../../../shared/EntityTypes.ts"
import { deleteRequest, get, patch, post } from "../../../services/ApiConfig.ts"
const baseUrl = "events"
import { useQuery } from "react-query"

export async function getEventsFromUser(
  user_id: string,
  token: string,
  page: number = 1,
  limit: number = 10,
): Promise<Page<EventModel>> {
  return get<Page<EventModel>>(
    baseUrl + `?user_id=${user_id}&show_hidden=1&page=${page}&limit=${limit}`,
    token,
  )
}

/**
 * Make HTTP post to the backend creating an event
 * @param description Event's name
 * @param startDate Event's start date in SQL format, i.e. YYYY-MM-DD
 * @param endDate Event's end date in SQL format, i.e. YYYY-MM-DD
 * @param scope Event's scope string.
 * @param is_public True if the event is publicly available on O-Replay main events searcher, false otherwise.
 * @param token Auth token of the user creating the event
 * @param website URL to the event's webpage on the organizer website
 * @param federation_id federation id of the data source
 * @param organizer_id organizer id of the data source
 */
export async function postEvent(
  description: string,
  startDate: string,
  endDate: string,
  scope:
    | "international"
    | "national"
    | "regional.high"
    | "regional.low"
    | "local"
    | "club"
    | string,
  is_public: boolean,
  token: string,
  website?: string,
  federation_id?: string,
  organizer_id?: string,
): Promise<Data<PostEventResponse>> {
  return post(
    baseUrl,
    {
      description: description,
      is_hidden: !is_public,
      initial_date: startDate,
      final_date: endDate,
      scope: scope,
      federation_id: federation_id ? federation_id : null,
      website: website ? website : null,
      organizer_id: organizer_id,
    },
    token,
  )
}

/**
 * Make HTTP patch to the backend updating an existing event
 * @param event_id Id of the event we want to edit
 * @param description Event's name
 * @param startDate Event's start date in SQL format, i.e. YYYY-MM-DD
 * @param endDate Event's end date in SQL format, i.e. YYYY-MM-DD
 * @param scope Event's scope string.
 * @param is_public True if the event is publicly available on O-Replay main events searcher, false otherwise.
 * @param token Auth token of the user creating the event
 * @param website URL to the event's webpage on the organizer website
 * @param federation_id federation id of the data source
 * @param organizer_id organizer id of the data source
 */
export async function patchEvent(
  event_id: string,
  description: string,
  startDate: string,
  endDate: string,
  scope:
    | "international"
    | "national"
    | "regional.high"
    | "regional.low"
    | "local"
    | "club"
    | string,
  is_public: boolean,
  token: string,
  website?: string,
  federation_id?: string,
  organizer_id?: string,
) {
  return patch(
    `${baseUrl}/${event_id}`,
    {
      description: description,
      is_hidden: !is_public,
      initial_date: startDate,
      final_date: endDate,
      scope: scope,
      federation_id: federation_id ? federation_id : null,
      website: website ? website : null,
      organizer_id: organizer_id,
    },
    token,
  )
}

/**
 * Make HTTP request to the backend to delete an event
 * @param id Id of the event to be deleted
 * @param token Authentication token
 */
export async function deleteEvent(id: string, token: string | null) {
  return await deleteRequest(`api/v1/events/${id}`, token)
}

/**
 * Make HTTP Request to the backend to create a stage in a given event
 * @param eventId
 * @param stageName
 * @param stageTypeId
 * @param token
 */
export async function postStage(
  eventId: string,
  stageName: string,
  stageTypeId: string,
  token: string | null,
): Promise<Data<PostStageResponse>> {
  return post(
    baseUrl + `/${eventId}/stages/`,
    {
      description: stageName,
      stage_type_id: stageTypeId,
    },
    token,
  )
}

/**
 * Make an HTTP request to the backend to update stage's information
 * @param eventId Id of the event the stage belongs to
 * @param stageId Id of the stage we want to edit
 * @param stageTypeId Id of the type the stage has
 * @param description New name of the stage
 * @param token User's authentication token
 */
export async function patchStage(
  eventId: string,
  stageId: string,
  description: string,
  stageTypeId: string,
  token: string,
) {
  return patch(
    `events/${eventId}/stages/${stageId}`,
    {
      description: description,
      stage_type_id: stageTypeId,
    },
    token,
  )
}

export async function deleteStage(eventId: string, stageId: string, token: string) {
  return deleteRequest(baseUrl + `/${eventId}/stages/${stageId}`, token)
}

/**
 * Remove all the runners in a stage without removing the stage. This option is useful when the
 * timekeeper finds any issue with the results uploaded to an event. They can remove the results
 * entirely and re-upload them from scratch to solve the issue.
 * @param eventId
 * @param stageId
 * @param token
 */
export async function wipeOutStage(eventId: string, stageId: string, token: string) {
  return deleteRequest(baseUrl + `/${eventId}/stages/${stageId}/?clean=1`, token)
}

/**
 * Creates a security token to upload runners to an event.
 * The token is set to be expired in one month time from the moment of creation.
 * @param eventId of the event that the token will be created for.
 * @param token user authentication token.
 * @param expiresIn Time that the token will expire in from now. Default value is 1 month.
 */
export async function postEventToken(eventId: string, token: string, expiresIn?: DateTime) {
  return post<Data<PostEventTokenResponse>>(
    baseUrl + `/${eventId}/tokens`,
    {
      expires: expiresIn
        ? expiresIn.toUTC()
        : DateTime.now().endOf("day").plus({ month: 1 }).toUTC(),
    },
    token,
  )
}

/**
 * Get the security token of a given event
 * @param eventId Id of the event that we want to gather the token from.
 * @param userToken user's event owner authentication token.
 */
export async function getEventToken(eventId: string, userToken: string | null) {
  return get<Data<[GetEventTokenResponse]>>(baseUrl + `/${eventId}/tokens/`, userToken)
}

/**
 * Invalidate and already existing security token for an event.
 * @param eventId Id of the event the token belongs to
 * @param eventToken Token to be invalidated
 * @param authToken User's authentication token to perform de action
 */
export async function invalidateEventToken(eventId: string, eventToken: string, authToken: string) {
  return deleteRequest(baseUrl + `/${eventId}/tokens/${eventToken}`, authToken)
}

export async function getOrganizerList(): Promise<Page<OrganizerModel>> {
  return await get<Page<OrganizerModel>>("organizers")
}

/**
 * Custom hook to manage organizer search using React Query.
 *
 * @returns The query result.
 */
export function useOrganizerSearch() {
  return useQuery<Page<OrganizerModel>>(
    ["organizers"], // Query key
    () => getOrganizerList(),
  )
}
