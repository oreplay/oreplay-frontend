import {
  ClassModel,
  ClubModel,
  ControlModel,
  OverallModel,
  OverallsModel,
  RunnerModel,
} from "../../../../../shared/EntityTypes.ts"
import { DateTime } from "luxon"

export interface ProcessedRunnerModel {
  id: string
  full_name: string
  bib_number: string
  is_nc: boolean
  eligibility: string
  sicard: bigint | null
  class: ClassModel
  runners?: RunnerModel[] | null
  club: ClubModel | null
  stage: ProcessedRunnerResultModel
  overalls: ProcessedOverallsModel | null
}

export interface ProcessedOverallsModel extends OverallsModel {
  parts: ProcessedOverallModel[]
  overall: ProcessedOverallModel
}

export interface ProcessedOverallModel extends OverallModel {}

export interface ProcessedRunnerResultModel {
  result_type_id: string
  start_time: string | null
  finish_time: string | null
  upload_type: string
  time_seconds: string
  position: bigint
  status_code: string | null
  time_behind: number
  points_final: bigint
  points_adjusted: bigint
  points_penalty: bigint
  points_bonus: bigint
  leg_number: number
  splits: ProcessedSplitModel[]
}

export interface ProcessedSplitModel {
  id: string
  is_intermediate: boolean
  reading_time: string
  order_number: number | null
  points: number | null
  time: number | null //time in seconds for this split
  time_behind: number | null //time behind best runner in seconds for this split
  position: number | null // position in this split
  cumulative_time: number | null //time in seconds since start
  cumulative_behind: number | null //time in seconds behind the best runner
  cumulative_position: number | null //position from start
  control: ControlModel | null
}

export interface RadioSplitModel extends ProcessedSplitModel {
  is_next: DateTime | null // indicates if it is the next radio control that the runner will punch
}
