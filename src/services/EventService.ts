import {ClassModel, EventDetailModel, EventModel, Page, RunnerModel} from "../shared/EntityTypes";
import { get } from "./ApiConfig";
const baseUrl: string = "/api/v1/events"

export async function getEventList(): Promise<Page<EventModel>> {
  return await get(baseUrl);
}

export async function getEventDetail(id:string): Promise<EventDetailModel> {
  return await get(`${baseUrl}/${id}`);
}

export async function getClassesInStage(event_id:string, stage_id:string): Promise<Page<ClassModel>> {
  const response = await get(baseUrl + `/${event_id}/stages/${stage_id}/classes`);
  console.log(response);
  return response;
}

export async function getRunnersInStage(event_id:string, stage_id:string): Promise<RunnerModel> {
  return await get(baseUrl + `/${event_id}/stages/${stage_id}`)
}