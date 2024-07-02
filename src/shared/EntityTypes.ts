import {useParams} from "react-router-dom";

export function useRequiredParams<T>() {
  return useParams() as T;
}

export interface EventModel {
  id: string,
  description: string,
  final_date: string,
  federation_id: string,
  created: string,
  modified: string,
}

export interface EventDetailModel {
  data: {
    id: string,
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
}

export interface StageModel {
  id: string,
  description: string,
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
  club: ClubModel,
  runner_results : RunnerResultModel[],
}

export interface RunnerResultModel {
  result_type_id: string,
  start_time: string,
  finish_time: string,
  time_seconds:string,
  position:bigint,
  status_code:string|null,
  time_behind: bigint,
  split: SplitsModel[],
}

export interface SplitsModel {
  id: string,
  reading_time:string,
  points: bigint|null,
  control: bigint|null,
}

export interface ClassModel {
  id: string,
  short_name: string,
}

export interface ClubModel{
  id: string,
  short_name:string
}

export interface Page<T> {
  data:T[];
}