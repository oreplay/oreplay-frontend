import {ClassModel, EventDetailModel, EventModel, Page, RunnerModel} from "../shared/EntityTypes";
import { get } from "./ApiConfig";
import {useEffect, useState} from "react";
const baseUrl: string = "/api/v1/events"

export async function getEventList(): Promise<Page<EventModel>> {
  return await get(baseUrl);
}

export async function getEventDetail(id:string): Promise<EventDetailModel> {
  return await get(`${baseUrl}/${id}`);
}

export async function getClassesInStage(event_id:string, stage_id:string): Promise<Page<ClassModel>> {
  return await get(baseUrl + `/${event_id}/stages/${stage_id}/classes`);
}

export async function getRunnersInStage(event_id:string, stage_id:string, class_id:string|null = null): Promise<Page<RunnerModel>> {
  if (class_id){
    return await get(baseUrl + `/${event_id}/stages/${stage_id}/runners?class_id=${class_id}`)
  } else {
    return await get(baseUrl + `/${event_id}/stages/${stage_id}/runners`)
  }
}

export function useRunners(event_id:string,stage_id:string,activeClass:ClassModel|null):[RunnerModel[],boolean] {
  const [isLoading,setIsLoading] = useState(true);
  const [runnerList, setRunnerList] = useState<RunnerModel[]>([])

  useEffect(() => {
    getRunnersInStage(event_id,stage_id,activeClass? activeClass.id : null).then((response)=>{
      setRunnerList(response.data)
      setIsLoading(false)
    })
    return () => {setIsLoading(true)}
  },[activeClass])

  return [runnerList,isLoading]
}