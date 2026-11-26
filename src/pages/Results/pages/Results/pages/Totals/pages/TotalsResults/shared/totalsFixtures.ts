import {
  ProcessedOverallModel,
  ProcessedRunnerModel,
} from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { UPLOAD_TYPES } from "../../../../../shared/constants.ts"

export const baseOverallFixture: ProcessedOverallModel = {
  id: "overallId",
  stage_order: null,
  upload_type: UPLOAD_TYPES.TOTAL_POINTS,
  position: 1,
  status_code: "0",
  time_seconds: null,
  time_behind: null,
  points_final: 100,
  points_behind: 0,
  note: null,
  contributory: true,
}

export const baseTotalsRunnerFixture: ProcessedRunnerModel = {
  id: "c3b2f0a4-7a51-4c1e-9f7e-2d8e4b6a1f90",
  bib_number: "100",
  is_nc: false,
  eligibility: null,
  class: {
    id: "classId",
    short_name: "ClassShort",
    long_name: "ClassLong",
  },
  club: {
    id: "clubId",
    short_name: "ClubName",
  },
  full_name: "Runner name",
  stage: {
    id: "stageID",
    result_type_id: "e4ddfa9d-3347-47e4-9d32-c6c119aeac0e",
    start_time: null,
    finish_time: null,
    upload_type: UPLOAD_TYPES.TOTAL_POINTS,
    time_seconds: 0,
    position: 1,
    status_code: "0",
    time_behind: 0,
    time_neutralization: 0,
    time_adjusted: 0,
    time_penalty: 0,
    time_bonus: 0,
    points_final: 100,
    points_behind: 0,
    points_adjusted: 0,
    points_penalty: 0,
    points_bonus: 0,
    splits: [],
    online_splits: [],
  },
  overalls: {
    parts: [],
    overall: baseOverallFixture,
  },
}
