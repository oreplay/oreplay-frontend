import {
  ClassModel,
  EventDetailModel,
  EventModel,
  Page,
  RunnerModel,
  Data,
  PostEventResponse
} from "../shared/EntityTypes";
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
 */
export function postEvent(
  description:string,
  startDate:string,
  endDate:string,
  scope:'international'|'national'|'regional.high'|'regional.low'|'local'|'club'|string,
  is_public:boolean,
  token:string,
  website?:string,
  federation_id?:string,
  ):Promise<Data<PostEventResponse>> {
  return post(
    baseUrl,
    {
      description:description,
      is_hidden: !is_public,
      initial_date:startDate,
      final_date:endDate,
      scope:scope,
      federation_id:federation_id ? federation_id : null,
      website: website ? website : null,
    },
    token
    )
}