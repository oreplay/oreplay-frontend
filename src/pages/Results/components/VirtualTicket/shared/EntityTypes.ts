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
  sex: string
  leg_number: number
  bib_number: string
  is_nc: boolean
  eligibility: string | null
  sicard: string | null
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
  id: string
  result_type_id: string
  start_time: string | null
  finish_time: string | null
  upload_type: string
  time_seconds: number
  position: number
  status_code: string | null
  time_behind: number
  time_neutralization: number
  time_adjusted: number
  time_penalty: number
  time_bonus: number
  points_final: number
  points_adjusted: number
  points_penalty: number
  points_bonus: number
  leg_number: number
  splits: ProcessedSplitModel[]
}

export interface ProcessedSplitModel {
  id: string
  is_intermediate: boolean
  reading_time: string | null
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
