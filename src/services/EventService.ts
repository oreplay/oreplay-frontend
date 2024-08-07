import {ClassModel, EventDetailModel, EventModel, Page, RunnerModel, Data} from "../shared/EntityTypes";
import {get, post} from "./ApiConfig";
const baseUrl: string = "/api/v1/events"

export async function getEventList(): Promise<Page<EventModel>> {
  return await get<Page<EventModel>>(baseUrl);
}

export async function getEventDetail(id:string,token?:string|null): Promise<Data<EventDetailModel>> {
  return await get<Data<EventDetailModel>>(`${baseUrl}/${id}`,token);
}

export async function getClassesInStage(event_id:string, stage_id:string): Promise<Page<ClassModel>> {
  return await get<Page<ClassModel>>(baseUrl + `/${event_id}/stages/${stage_id}/classes`);
}

export async function getRunnersInStage(event_id:string, stage_id:string, class_id?:string): Promise<Page<RunnerModel>> {
  let url = `/${event_id}/stages/${stage_id}/runners`;
  if (class_id) {
    url = url + `?class_id=${class_id}`;
  }
  return await get<Page<RunnerModel>>(baseUrl + url)
}

export function getEventsFromUser(user_id:string, token:string, page:number=1,limit:number=10): Promise<Page<EventModel>> {
  return get<Page<EventModel>>(baseUrl+`?user_id=${user_id}&show_hidden=1&page=${page}&limit=${limit}`,token)
}

export function postEvent(
  description:string,
  startDate:string,
  finishDate:string,
  token:string,
  federation_id?:string,
  ) {
  return post(
    baseUrl,
    {
      description:description,
      initial_date:startDate,
      final_date:finishDate,
      federation_id:federation_id,
    },
    token
    )
}