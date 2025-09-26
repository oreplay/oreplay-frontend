import {
  ClassModel,
  ClubModel,
  ControlModel,
  OverallModel,
  OverallsModel,
} from "../../../../../shared/EntityTypes.ts"
import { DateTime } from "luxon"

export interface ProcessedParticipantModel {
  id: string
  full_name: string
  sex?: string
  bib_number: string
  is_nc: boolean
  eligibility: string | null
  sicard?: string | null
  leg_number?: number
  club: ClubModel | null
  class: ClassModel | null
  stage: ProcessedRunnerResultModel
  overalls: ProcessedOverallsModel | null
}

export interface ProcessedTeamRunnerModel extends ProcessedParticipantModel {
  leg_number: number
}

export interface ProcessedRunnerModel extends ProcessedParticipantModel {
  class: ClassModel
  runners?: ProcessedTeamRunnerModel[] | null
}

export interface ProcessedOverallsModel extends OverallsModel {
  parts: ProcessedOverallModel[]
  overall: ProcessedOverallModel
}

export interface ProcessedOverallModel extends OverallModel {
  status_code: string
}

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
  leg_number?: number
  splits: ProcessedSplitModel[]
  online_splits: RadioSplitModel[] | null
}

export interface ProcessedSplitModel {
  id: string
  is_intermediate: boolean
  reading_time: string | null
  order_number: number | null
  points: number | null
  control: ControlModel | null
  time: number | null //time in seconds for this split
  time_behind: number | null //time behind best runner in seconds for this split
  position: number | null // position in this split
  cumulative_time: number | null //time in seconds since start
  cumulative_behind: number | null //time in seconds behind the best runner
  cumulative_position: number | null //position from start
}

export interface RadioSplitModel extends ProcessedSplitModel {
  /**
   * Indicates whether this is the next radio control
   * that the runner is expected to punch.
   *  - `null` means it is not the next control.
   *  - The datetime is the reading time of the previously punched online control
   */
  is_next: DateTime | null
}
