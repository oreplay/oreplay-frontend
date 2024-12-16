import {useParams} from "react-router-dom";

/**
 * Paginated list from backend
 */
export interface Page<T> {
  data:T[],
  total:number,
  limit:number
}

/**
 * Single element from Backend encapsulated in data
 */
export interface Data<T>{
  data: T
}

/**
 * useParams hook adding casting to the desired type. This removes the possibility of params being
 * null. It can be safely used when the params are mandatory
 */
export function useRequiredParams<T>() {
  return useParams() as T;
}

export interface EventModel {
  id: string,
  description: string,
  picture:string|null,
  website:string|null,
  scope:null,
  location:string|null,
  initial_date: string,
  final_date: string,
  federation_id: string,
  created: string,
  modified: string,
}

export interface EventDetailModel {
  id: string,
  is_hidden: boolean,
  description: string,
  picture:string,
  website: string,
  scope: string,
  location: string,
  initial_date: string,
  final_date: string,
  federation_id: string,
  created: string,
  modified: string,
  federation: FederationModel,
  stages: StageModel[]
}

export interface StageTypeModel {
  id: string,
  description: "Chase Start"|"Foot-O, MTBO, Ski-O"|"Rogaine"|"Relay"|"Raid"|"Mass Start"|"Trail-O",
}

export interface StageModel {
  id: string,
  description: string,
  stage_type: StageTypeModel
}

export interface FederationModel {
  id: string,
  description: string
}

export interface RunnerModel {
  id: string,
  first_name: string,
  last_name: string,
  bib_number:string,
  sicard: bigint|null,
  class: ClassModel,
  club: ClubModel|null,
  runner_results : RunnerResultModel[],
}

export interface RunnerResultModel {
  result_type_id: string,
  start_time: string|null,
  finish_time: string|null,
  time_seconds: string,
  position: bigint,
  status_code: string|null,
  time_behind: bigint,
  points_final: bigint,
  points_adjusted: bigint,
  points_penalty: bigint,
  points_bonus: bigint,
  leg_number: bigint,
  splits:SplitModel[],
}

export interface SplitModel {
  id: string,
  reading_time: string,
  order_number: bigint|null,
  points: bigint|null,
  control: ControlModel,
}

export interface ControlModel {
  id: string,
  station: string,
  control_type: ControlTypeModel
}

export interface ControlTypeModel {
  id: string,
  description: string,
}

export interface ClassModel {
  id: string,
  short_name: string,
}

export interface ClubModel{
  id: string,
  short_name: string
}

export interface UserModel {
  id:string,
  email:string,
  first_name: string,
  last_name: string,
  created: string,
  modified:string,
  token:{
    "access_token":string,
    "token_type":string,
  }
}

export interface UserEvent {
  id:string,
  email:string,
  first_name:string,
  last_name:string,
  created:string,
  modified:string
}

export interface PostEventResponse {
  id:string,
  description: string,
  initial_date: string,
  final_date:string,
  users:UserEvent[]
}

export interface PostStageResponse {
  id: string,
  description: string,
  stage_type: StageModel,
}

export interface PostEventTokenResponse {
  id:string,
  expires:string,
  token:string,
}

export interface GetEventTokenResponse {
  token:string,
  expires:string,
  created:string
}