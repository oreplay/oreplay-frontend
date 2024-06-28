import {ClassModel, EventDetailModel, EventModel, Page, RunnerModel} from "../shared/EntityTypes";
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || 'https://localhost/'
const baseUrl = API_DOMAIN + "api/v1/events"

export async function getEventList(): Promise<Page<EventModel>> {
    const response = await fetch(baseUrl, {
        method: "GET"
    });
    return await response.json();
}

export async function getEventDetail(id:string): Promise<EventDetailModel> {
    const response = await fetch(baseUrl + `/${id}`, {
        method: "GET"
    });
    return await response.json();
}

export async function getClassesInStage(event_id:string, stage_id:string): Promise<Page<ClassModel>> {
  const response = await fetch(baseUrl + `/${event_id}/stages/${stage_id}/classes`, {
    method:'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cross-Origin': '*',
    })
  })
  console.log(response);
  return await response.json();
}

export async function getRunnersInStage(event_id:string, stage_id:string): Promise<RunnerModel> {
  const response = await fetch(baseUrl + `/${event_id}/stages/${stage_id}`, {
    method: 'GET',
  })
  return await response.json();
}