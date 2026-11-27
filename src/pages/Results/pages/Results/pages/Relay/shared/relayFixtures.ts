import {
  ProcessedParticipantModel,
  ProcessedRunnerModel,
  ProcessedTeamRunnerModel,
  RadioSplitModel,
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { NORMAL_CONTROL } from "../../../../../shared/constants.ts"

export const baseParticipantFixture: ProcessedParticipantModel = {
  id: "legId",
  bib_number: "100-1",
  is_nc: false,
  eligibility: null,
  sicard: "123456789",
  sex: "F",
  class: null,
  club: {
    id: "ClubId",
    short_name: "Club",
  },
  full_name: "Leg Full Name",
  stage: {
    id: "legStageId",
    result_type_id: "e4ddfa9d-3347-47e4-9d32-c6c119aeac0e",
    start_time: "2025-10-26T09:00:00.000+00:00",
    finish_time: "2025-10-26T09:01:00.000+00:00",
    upload_type: "res_finish",
    time_seconds: 60,
    position: 0,
    status_code: "0",
    time_behind: 0,
    time_neutralization: 0,
    time_adjusted: 0,
    time_penalty: 0,
    time_bonus: 0,
    points_final: 0,
    points_behind: 0,
    points_adjusted: 0,
    points_penalty: 0,
    points_bonus: 0,
    leg_number: 1,
    splits: [],
    online_splits: [],
  },
  overalls: null,
}

export const baseLegFixture: ProcessedTeamRunnerModel = {
  ...baseParticipantFixture,
  leg_number: 1,
}

export const baseRelayRunnerFixture: ProcessedRunnerModel = {
  id: "07ec30e6-3953-4676-a5b7-6410851a8f64",
  bib_number: "100",
  is_nc: false,
  eligibility: null,
  runners: [],
  class: {
    id: "classId",
    short_name: "ClassShort",
    long_name: "ClassLong",
  },
  club: {
    id: "clubId",
    short_name: "ClubName",
  },
  full_name: "Team name",
  stage: {
    id: "stageID",
    result_type_id: "e4ddfa9d-3347-47e4-9d32-c6c119aeac0e",
    start_time: null,
    finish_time: null,
    upload_type: "res_finish",
    time_seconds: 0,
    position: 0,
    status_code: "0",
    time_behind: 2117,
    time_neutralization: 0,
    time_adjusted: 0,
    time_penalty: 0,
    time_bonus: 0,
    points_final: 0,
    points_behind: 0,
    points_adjusted: 0,
    points_penalty: 0,
    points_bonus: 0,
    leg_number: 4,
    splits: [],
    online_splits: [],
  },
  overalls: null,
}

/**
 * Builds a leg runner for relay tests.
 *
 * @param legNumber Number of the leg, from 1.
 * @param stage Fields of the leg result to set, such as its start, finish, time and online splits.
 * @returns The leg runner, OK and with a unique id per leg number.
 */
export function buildLegFixture(
  legNumber: number,
  stage: Partial<ProcessedTeamRunnerModel["stage"]>,
): ProcessedTeamRunnerModel {
  return {
    ...baseLegFixture,
    id: `leg-${legNumber}`,
    leg_number: legNumber,
    stage: { ...baseLegFixture.stage, ...stage, leg_number: legNumber },
  }
}

/**
 * Builds an online split for relay tests.
 *
 * @param station Station of the radio control, or `null` for the finish.
 * @param cumulativeSeconds Leg time at the split, or `null` without a reading.
 * @returns The online split.
 */
export function buildRadioSplitFixture(
  station: string | null,
  cumulativeSeconds: number | null,
): RadioSplitModel {
  return {
    control: station ? { control_type: NORMAL_CONTROL, id: `control-${station}`, station } : null,
    cumulative_behind: null,
    cumulative_position: null,
    cumulative_time: cumulativeSeconds,
    id: `split-${station ?? "finish"}`,
    is_intermediate: true,
    is_next: null,
    order_number: null,
    points: null,
    position: null,
    reading_time: null,
    time: null,
    time_behind: null,
  }
}

/**
 * Builds a relay team for relay tests.
 *
 * @param id Identifier of the team.
 * @param startTime Start of the team's first leg, as ISO 8601.
 * @param legs Leg runners of the team.
 * @returns The team, OK and not finished; each leg id is prefixed with the team id.
 */
export function buildTeamFixture(
  id: string,
  startTime: string,
  legs: ProcessedTeamRunnerModel[],
): ProcessedRunnerModel {
  return {
    ...baseRelayRunnerFixture,
    full_name: `Team ${id}`,
    id,
    runners: legs.map((leg) => ({ ...leg, id: `${id}-${leg.id}` })),
    stage: { ...baseRelayRunnerFixture.stage, start_time: startTime, time_behind: 0 },
  }
}
