import {ClassModel, ClubModel, ControlModel} from "../../../../../shared/EntityTypes.ts";

export interface ProcessedRunnerModel {
  id: string,
  first_name: string,
  last_name: string,
  bib_number:string,
  sicard: bigint|null,
  class: ClassModel,
  club: ClubModel,
  runner_results : ProcessedRunnerResultModel[],
}

export interface ProcessedRunnerResultModel {
  result_type_id: string,
  start_time: string,
  finish_time: string,
  time_seconds: string,
  position: bigint,
  status_code: string|null,
  time_behind: bigint,
  points_final: bigint,
  points_adjusted: bigint,
  points_penalty: bigint,
  points_bonus: bigint,
  leg_number: bigint,
  splits:ProcessedSplitModel[],
}

export interface ProcessedSplitModel {
  id: string,
  reading_time: string,
  order_number: bigint|number|null,
  points: bigint|null,
  time:number|null, //time in seconds for this split
  time_behind: number|null, //time behind best runner in seconds for this split
  position: number|null, // position in this split
  cumulative_time: number|null //time in seconds since start
  cumulative_behind: number|null //time in seconds behind the best runner
  cumulative_position:number|null //position from start
  control: ControlModel|null,
}