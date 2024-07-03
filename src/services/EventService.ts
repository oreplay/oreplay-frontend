import {ClassModel, EventDetailModel, EventModel, Page, RunnerModel, Data} from "../shared/EntityTypes";
import { get } from "./ApiConfig";
import {useEffect, useState} from "react";
const baseUrl: string = "/api/v1/events"

export async function getEventList(): Promise<Page<EventModel>> {
  return await get<Page<EventModel>>(baseUrl);
}

export async function getEventDetail(id:string): Promise<Data<EventDetailModel>> {
  return await get<Data<EventDetailModel>>(`${baseUrl}/${id}`);
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

export function useRunners(event_id:string,stage_id:string,activeClass:ClassModel|null):[RunnerModel[],boolean] {
  const [isLoading,setIsLoading] = useState(true);
  const [runnerList, setRunnerList] = useState<RunnerModel[]>([])

  useEffect(() => {
    if (activeClass){
    getRunnersInStage(event_id,stage_id,activeClass.id).then((response)=>{
      setRunnerList(response.data)
      setIsLoading(false)
      })
    } else {
      setRunnerList([])
      setIsLoading(false);
    }
    return () => {
      setIsLoading(true)
    }
  },[event_id,stage_id,activeClass])

  return [runnerList,isLoading]
}

export function getEventsFromUser(user_id:string, token:string, page:number=1,limit:number=10): Promise<Page<EventModel>> {
  return get<Page<EventModel>>(baseUrl+`?user_id=${user_id}&show_hidden=1&page=${page}&limit=${limit}`,token)
}