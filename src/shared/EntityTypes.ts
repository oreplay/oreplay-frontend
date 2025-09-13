import { useParams } from "react-router-dom"

/**
 * Paginated list from backend
 */
export interface Page<T> {
  data: T[]
  total: number
  limit: number
}

/**
 * Single element from Backend encapsulated in data
 */
export interface Data<T> {
  data: T
}

/**
 * useParams hook adding casting to the desired type. This removes the possibility of params being
 * null. It can be safely used when the params are mandatory
 */
export function useRequiredParams<T>() {
  return useParams() as T
}

export interface EventModel {
  id: string
  description: string
  is_hidden: boolean
  picture: string | null
  website: string | null
  scope: null
  location: string | null
  initial_date: string
  final_date: string
  federation_id: string
  created: string
  modified: string
  organizer: OrganizerModel
}

export interface EventDetailModel {
  id: string
  is_hidden: boolean
  description: string
  picture: string
  website: string
  scope: string
  location: string
  initial_date: string
  final_date: string
  federation_id: string
  created: string
  modified: string
  federation: FederationModel
  stages: StageModel[]
  organizer: OrganizerModel | null
}

export interface StageTypeModel {
  id: string
  description:
    | "Chase Start"
    | "Foot-O, MTBO, Ski-O"
    | "Rogaine"
    | "Relay"
    | "Raid"
    | "Mass Start"
    | "Trail-O"
}

export enum StateLogConst {
  CLEAR = 0,
  START = 1,
  RESULT = 2,
  ENDED = 3,
}

export interface StateLog {
  state: StateLogConst
  created: string
}

export interface StageModel {
  id: string
  description: string
  last_logs: StateLog[]
  stage_type: StageTypeModel
}

export interface FederationModel {
  id: string
  description: string
}

export interface OrganizerModel {
  id: string
  name: string
  country: string
  region: string
}

export interface ParticipantModel {
  id: string
  full_name: string
  sex?: string
  bib_number: string
  is_nc: boolean
  eligibility: string | null
  sicard?: string | null
  leg_number?: number
  class: ClassModel | null
  club: ClubModel | null
  stage: RunnerResultModel
  overalls: OverallsModel | null
}

export interface TeamRunner extends ParticipantModel {
  leg_number: number
}

export interface RunnerModel extends ParticipantModel {
  class: ClassModel
  runners?: TeamRunner[] | null
}

// Todo: Fusion RunnerResultModel and OverallModel
export interface RunnerResultModel {
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
  splits: SplitModel[]
  contributory?: boolean
}

export interface SplitModel {
  id: string
  is_intermediate: boolean
  reading_time: string | null
  order_number: number | null
  points: number | null
  control: ControlModel
}

export interface OnlineControlModel {
  id: string
  station: string
}

export interface ControlModel {
  id: string
  station: string
  control_type: ControlTypeModel
}

export interface ControlTypeModel {
  id: string
  description: string
}

export interface ClassModel {
  id: string
  short_name: string
  long_name: string
}

export interface StageClassModel extends ClassModel {
  splits: OnlineControlModel[]
}

export interface ClubModel {
  id: string
  short_name: string
}

export interface OverallsModel {
  parts: OverallModel[]
  overall: OverallModel
}

export interface StageOrder {
  id: string
  description: string
}

export interface OverallModel {
  id: string
  stage_order: number | null
  upload_type: string
  stage?: StageOrder | null
  position: number | null
  status_code: number | null
  time_seconds: number | null
  points_final: number | null
  note: string | null
  contributory?: boolean
}

export interface UserModel {
  id: string
  email: string
  first_name: string
  last_name: string
  created: string
  modified: string
  token: {
    access_token: string
    token_type: string
  }
}

export interface UserEvent {
  id: string
  email: string
  first_name: string
  last_name: string
  created: string
  modified: string
}

export interface PostEventResponse {
  id: string
  description: string
  initial_date: string
  final_date: string
  users: UserEvent[]
}

export interface PostStageResponse {
  id: string
  description: string
  stage_type: StageModel
}

export interface PostEventTokenResponse {
  id: string
  expires: string
  token: string
}

export interface GetEventTokenResponse {
  token: string
  expires: string
  created: string
}
