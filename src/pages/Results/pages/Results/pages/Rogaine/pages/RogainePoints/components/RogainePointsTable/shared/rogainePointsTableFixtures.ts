import {
  ProcessedRunnerModel,
  ProcessedSplitModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../../../../../../../../shared/constants.ts"
import { UPLOAD_TYPES } from "../../../../../../../shared/constants.ts"

export interface RogaineRunnerFixtureOptions {
  finishTime?: string | null
  pointsBonus?: number
  pointsFinal?: number
  pointsPenalty?: number
  stations?: string[]
}

export const FIXTURE_FINISH_TIME = "2025-06-27T10:00:00.000+00:00"
export const FIXTURE_STATIONS = ["31", "41"]

/**
 * Builds a finished rogaine runner punching the given stations, for tests.
 *
 * @param id Id and name of the runner.
 * @param options Overrides for the punched stations, finish time and points.
 * @returns A processed runner with one split per punched station.
 */
export function buildRogaineRunnerFixture(
  id: string,
  options: RogaineRunnerFixtureOptions = {},
): ProcessedRunnerModel {
  const splits = (options.stations ?? FIXTURE_STATIONS).map(
    (station, index): ProcessedSplitModel => ({
      id: `${id}-split${index + 1}`,
      is_intermediate: false,
      reading_time: null,
      order_number: index + 1,
      points: 10,
      control: {
        id: `control${station}`,
        station,
        control_type: { id: "normal", description: "Normal control" },
      },
      time: null,
      time_behind: null,
      position: null,
      cumulative_time: null,
      cumulative_behind: null,
      cumulative_position: null,
    }),
  )

  return {
    id,
    full_name: id,
    bib_number: id,
    is_nc: false,
    eligibility: null,
    sicard: null,
    club: null,
    class: { id: "class", short_name: "C", long_name: "Class" },
    stage: {
      id: `${id}-stage`,
      result_type_id: "result-type",
      start_time: "2025-06-27T09:00:00.000+00:00",
      finish_time: options.finishTime === undefined ? FIXTURE_FINISH_TIME : options.finishTime,
      upload_type: UPLOAD_TYPES.SPLIT_RESULT,
      time_seconds: 3600,
      position: 1,
      status_code: RESULT_STATUS.ok,
      time_behind: 0,
      time_neutralization: 0,
      time_adjusted: 0,
      time_penalty: 0,
      time_bonus: 0,
      points_final: options.pointsFinal ?? 0,
      points_behind: 0,
      points_adjusted: 0,
      points_penalty: options.pointsPenalty ?? 0,
      points_bonus: options.pointsBonus ?? 0,
      leg_number: 1,
      splits,
      online_splits: [],
    },
    overalls: null,
  }
}
