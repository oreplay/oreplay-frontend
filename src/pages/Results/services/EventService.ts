import { get } from "../../../services/ApiConfig.ts";
import {
  ClassModel,
  Data,
  EventDetailModel,
  EventModel,
  Page,
  RunnerModel,
  StageModel,
} from "../../../shared/EntityTypes.ts";
const baseUrl = "api/v1/events";

export async function getEventList(
  page: number = 1,
  when?: "today" | "past" | "future",
  token?: string | null,
  limit?: number,
): Promise<Page<EventModel>> {
  const searchParams = new URLSearchParams();

  // set different search params
  searchParams.set("page", page.toString());
  if (when) {
    searchParams.set("when", when);
  }
  if (limit) {
    searchParams.set("limit", limit.toString());
  }

  // return query
  return await get<Page<EventModel>>(`${baseUrl}?${searchParams.toString()}`, token);
}

export async function getEventDetail(
  id: string,
  token?: string | null,
): Promise<Data<EventDetailModel>> {
  return await get<Data<EventDetailModel>>(`${baseUrl}/${id}`, token);
}

export async function getStageDetail(
  eventId: string,
  stageId: string,
  token?: string | null,
): Promise<Data<StageModel>> {
  return await get<Data<StageModel>>(`${baseUrl}/${eventId}/stages/${stageId}`, token);
}

export async function getClassesInStage(
  event_id: string,
  stage_id: string,
): Promise<Page<ClassModel>> {
  return await get<Page<ClassModel>>(baseUrl + `/${event_id}/stages/${stage_id}/classes`);
}

export async function getRunnersInStage(
  event_id: string,
  stage_id: string,
  class_id?: string,
): Promise<Page<RunnerModel>> {
  let url = `/${event_id}/stages/${stage_id}/runners`;
  if (class_id) {
    url = url + `?class_id=${class_id}`;
  }
  return await get<Page<RunnerModel>>(baseUrl + url);
}
