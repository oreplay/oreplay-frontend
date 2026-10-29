import { get } from "../../../services/ApiConfig.ts"
import {
  ClubModel,
  Data,
  EventDetailModel,
  EventModel,
  Page,
  RunnersPage,
  StageClassModel,
  StageModel,
} from "../../../shared/EntityTypes.ts"
import { queryClient } from "../../../infrastructure/queryClient.ts"
import { updateCachedStageLastLogs } from "./eventDetailCache.ts"
const baseUrl = "events"

export async function getEventList(
  page: number = 1,
  when?: "today" | "past" | "future",
  token?: string | null,
  limit?: number,
): Promise<Page<EventModel>> {
  const searchParams = new URLSearchParams()

  // set different search params
  searchParams.set("page", page.toString())
  if (when) {
    searchParams.set("when", when)
  }
  if (limit) {
    searchParams.set("limit", limit.toString())
  }

  // return query
  return await get<Page<EventModel>>(`${baseUrl}?${searchParams.toString()}`, token)
}

export async function getEventDetail(
  id: string,
  token?: string | null,
): Promise<Data<EventDetailModel>> {
  return await get<Data<EventDetailModel>>(`${baseUrl}/${id}`, token)
}

export async function getStageDetail(
  eventId: string,
  stageId: string,
  token?: string | null,
): Promise<Data<StageModel>> {
  return await get<Data<StageModel>>(`${baseUrl}/${eventId}/stages/${stageId}`, token)
}

export async function getClassesInStage(
  event_id: string,
  stage_id: string,
): Promise<Page<StageClassModel>> {
  return await get<Page<StageClassModel>>(baseUrl + `/${event_id}/stages/${stage_id}/classes`)
}

/**
 * Fetch all clubs that belong to a given stage
 * @param event_id ID of the event that the stage belongs to
 * @param stage_id ID of the stage we want to gather data from
 */
export async function getClubsInStage(
  event_id: string,
  stage_id: string,
): Promise<Page<ClubModel>> {
  return await get<Page<ClubModel>>(`${baseUrl}/${event_id}/stages/${stage_id}/clubs`)
}

/**
 * Fetches a stage's runners with their results, filtered by class or by club. The stage's latest
 * state logs come with them and are stored in the cached event detail, so the stage's live and
 * official status stay as fresh as the results on screen.
 * @param event_id Event the stage belongs to.
 * @param stage_id Stage whose runners are fetched.
 * @param class_id Class to list the runners of; omitted when filtering by club.
 * @param club_id Club to list the runners of; omitted when filtering by class.
 * @returns The runners, plus the stage's latest state logs when the backend sends them.
 */
export async function getRunnersInStage(
  event_id: string,
  stage_id: string,
  class_id?: string,
  club_id?: string,
): Promise<RunnersPage> {
  let url = `/${event_id}/stages/${stage_id}/results`

  // Set url search params
  const urlSearchParam = new URLSearchParams()

  if (class_id) {
    urlSearchParam.set("class_id", class_id)
    urlSearchParam.set("forceSameDay", "true")
  }
  if (club_id) {
    urlSearchParam.set("club_id", club_id)
  }

  // Build final url and make query
  url = url + `?${urlSearchParam.toString()}`

  const runnersPage = await get<RunnersPage>(baseUrl + url)
  if (runnersPage.last_logs) {
    updateCachedStageLastLogs(queryClient, event_id, stage_id, runnersPage.last_logs)
  }
  return runnersPage
}
