import {
  ProcessedRunnerModel,
  ProcessedSplitModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../../../../../../../../shared/constants.ts"
import { UPLOAD_TYPES } from "../../../../../../../shared/constants.ts"
import {
  RunnerTimeLossInfo,
  TimeLossAnalysis,
  TimeLossResults,
} from "../../../../../shared/timeLossAnalysis.ts"

export interface RunnerFixtureLeg {
  station: string
  time: number
}

export interface RunnerFixtureOptions {
  statusCode?: string
  uploadType?: string
}

export const FIXTURE_LEGS: RunnerFixtureLeg[] = [
  { station: "31", time: 60 },
  { station: "41", time: 90 },
  { station: "51", time: 120 },
]

function buildTimeLossInfoFixture(timeLoss: number): RunnerTimeLossInfo {
  return {
    hasTimeLoss: timeLoss > 0,
    isBest: false,
    isTopThree: false,
    position: 4,
    rank: 4,
    splitTime: 0,
    timeLoss,
  }
}

export function buildTimeLossResultsFixture(
  runnerId: string,
  lossPerLeg: Record<string, number>,
): TimeLossResults {
  const analyses = Object.entries(lossPerLeg).map(
    ([controlId, timeLoss], index): [string, TimeLossAnalysis] => [
      controlId,
      {
        bestTime: 0,
        controlId,
        estimatedTimeWithoutError: 0,
        orderNumber: index + 1,
        runnerAnalysis: new Map([[runnerId, buildTimeLossInfoFixture(timeLoss)]]),
      },
    ],
  )
  return {
    analysisPerControl: new Map(analyses),
    globalStats: { totalControls: 0, totalSplitsAnalyzed: 0, totalTimeLossDetected: 0 },
  }
}

export function buildRunnerFixture(
  id: string,
  legs: RunnerFixtureLeg[] = FIXTURE_LEGS,
  options: RunnerFixtureOptions = {},
): ProcessedRunnerModel {
  let cumulativeTime = 0
  const splits = legs.map((leg, index): ProcessedSplitModel => {
    cumulativeTime += leg.time
    return {
      id: `${id}-split${index + 1}`,
      is_intermediate: true,
      reading_time: null,
      order_number: index + 1,
      points: 0,
      control: {
        id: `control${leg.station}`,
        station: leg.station,
        control_type: { id: "normal", description: "Normal control" },
      },
      time: leg.time,
      time_behind: 0,
      position: 1,
      cumulative_time: cumulativeTime,
      cumulative_behind: 0,
      cumulative_position: 1,
    }
  })

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
      finish_time: "2025-06-27T09:10:00.000+00:00",
      upload_type: options.uploadType ?? UPLOAD_TYPES.SPLIT_RESULT,
      time_seconds: cumulativeTime,
      position: 1,
      status_code: options.statusCode ?? RESULT_STATUS.ok,
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
      splits,
      online_splits: [],
    },
    overalls: null,
  }
}
