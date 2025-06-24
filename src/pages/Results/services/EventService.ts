import { get } from "../../../services/ApiConfig.ts"
import {
  ClubModel,
  Data,
  EventDetailModel,
  EventModel,
  Page,
  RunnerModel,
  StageClassModel,
  StageModel,
} from "../../../shared/EntityTypes.ts"
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

export async function getRunnersInStage(
  event_id: string,
  stage_id: string,
  class_id?: string,
  club_id?: string,
): Promise<Page<RunnerModel>> {
  let url = `/${event_id}/stages/${stage_id}/results`

  // Set url search params
  const urlSearchParam = new URLSearchParams()

  if (class_id) {
    urlSearchParam.set("class_id", class_id)
  }
  if (club_id) {
    urlSearchParam.set("club_id", club_id)
  }

  // Build final url and make query
  url = url + `?${urlSearchParam.toString()}`

  return await get<Page<RunnerModel>>(baseUrl + url)
}
