import { describe, it, expect } from "vitest"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../../../../shared/constants.ts"
import {
  analyzeTimeLoss,
  competitionRanks,
  computeLegLoss,
  computeLegReference,
  computeRunnerLevel,
  DEFAULT_RUNNER_LEVEL,
  FINISH_LEG_ID,
  getRunnerTimeLossInfo,
  legMistakeFloor,
  mean,
  median,
  MIN_RUNNER_LEVEL,
  trimmedMean,
} from "./timeLossAnalysis.ts"

interface LegSpec {
  controlId: string
  time: number
}

interface RunnerOptions {
  statusCode?: string
  position?: number
  runInSeconds?: number
}

const buildControl = (id: string) => ({
  id,
  station: id,
  control_type: { id: "normal", description: "Normal control" },
})

const makeRunner = (
  id: string,
  legs: LegSpec[],
  options: RunnerOptions = {},
): ProcessedRunnerModel => {
  let cumulative = 0
  const splits = legs.map((leg, index) => {
    cumulative += leg.time
    return {
      id: `${id}-s${index + 1}`,
      is_intermediate: true,
      reading_time: null,
      order_number: index + 1,
      points: null,
      control: buildControl(leg.controlId),
      time: leg.time,
      time_behind: null,
      position: null,
      cumulative_time: cumulative,
      cumulative_behind: null,
      cumulative_position: null,
    }
  })

  return {
    id,
    full_name: id,
    bib_number: id,
    is_nc: options.statusCode === RESULT_STATUS.nc,
    eligibility: null,
    sicard: null,
    club: null,
    class: { id: "class", short_name: "C", long_name: "Class" },
    stage: {
      id: `${id}-stage`,
      result_type_id: "result-type",
      start_time: "2025-06-27T09:00:00.000+00:00",
      finish_time: "2025-06-27T09:10:00.000+00:00",
      upload_type: "res_splits",
      time_seconds: cumulative + (options.runInSeconds ?? 0),
      position: options.position ?? 0,
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

const cleanLegs: LegSpec[] = [
  { controlId: "c1", time: 60 },
  { controlId: "c2", time: 90 },
  { controlId: "c3", time: 120 },
]

const buildField = (): ProcessedRunnerModel[] => [
  makeRunner("r1", cleanLegs, { position: 1 }),
  makeRunner("r2", cleanLegs, { position: 2 }),
  makeRunner("r3", cleanLegs, { position: 3 }),
  makeRunner(
    "slow",
    [
      { controlId: "c1", time: 72 },
      { controlId: "c2", time: 108 },
      { controlId: "c3", time: 144 },
    ],
    { position: 5 },
  ),
  makeRunner("r5", cleanLegs, { position: 4 }),
  makeRunner(
    "blunder",
    [
      { controlId: "c1", time: 60 },
      { controlId: "c2", time: 240 },
      { controlId: "c3", time: 120 },
    ],
    { position: 6 },
  ),
]

describe("statistical helpers", () => {
  it("mean averages the values and treats an empty list as zero", () => {
    expect(mean([3, 6, 9])).toBe(6)
    expect(mean([])).toBe(0)
  })

  it("median returns the middle value for odd and even length lists", () => {
    expect(median([5, 1, 3])).toBe(3)
    expect(median([1, 2, 3, 4])).toBe(2.5)
    expect(median([7])).toBe(7)
    expect(median([])).toBe(0)
  })

  it("trimmedMean drops the slowest fraction before averaging", () => {
    expect(trimmedMean([1, 1, 1, 10], 0.25)).toBe(1)
    expect(trimmedMean([2, 4], 0.25)).toBe(3)
    expect(trimmedMean([], 0.25)).toBe(0)
  })
})

describe("computeLegReference", () => {
  it("falls back to the fastest split when the field is small", () => {
    expect(computeLegReference([50, 60, 70])).toBe(50)
    expect(computeLegReference([10, 20, 30, 40, 50, 60, 70])).toBe(10)
  })

  it("averages the fastest quartile once the field is large enough", () => {
    expect(computeLegReference([10, 20, 30, 40, 50, 60, 70, 80])).toBe(30)
  })

  it("drops the single fastest split so one bad reading cannot set the reference", () => {
    expect(computeLegReference([40, 90, 92, 94, 96, 98, 100, 102, 104, 300])).toBe(92)
  })

  it("still drops the fastest split at the smallest field that skips the min fallback", () => {
    expect(computeLegReference([5, 90, 92, 94, 96, 98, 100, 102])).toBe(92)
    expect(computeLegReference([5, 90, 92, 94, 96, 98, 100, 102, 104])).toBe(92)
  })

  it("is unaffected by a lone outlier in a uniform field", () => {
    expect(computeLegReference([1, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60])).toBe(51)
  })
})

describe("competitionRanks", () => {
  it("numbers strictly increasing leg times 1..n", () => {
    expect(competitionRanks([10, 20, 30, 40])).toEqual([1, 2, 3, 4])
  })

  it("shares a rank between tied leg times and skips the next", () => {
    expect(competitionRanks([10, 20, 30, 30, 50])).toEqual([1, 2, 3, 3, 5])
    expect(competitionRanks([10, 10, 10])).toEqual([1, 1, 1])
  })

  it("handles an empty leg", () => {
    expect(competitionRanks([])).toEqual([])
  })
})

describe("computeRunnerLevel", () => {
  it("returns the default level when there are too few legs", () => {
    expect(computeRunnerLevel([1.1, 1.2], 0.15)).toBe(DEFAULT_RUNNER_LEVEL)
  })

  it("ignores the runner's own mistakes when estimating the level", () => {
    expect(computeRunnerLevel([1, 1, 1, 1, 5], 0.15)).toBe(1)
  })

  it("clamps the level so it never drops below the minimum", () => {
    expect(computeRunnerLevel([0.2, 0.2, 0.2], 0.15)).toBe(MIN_RUNNER_LEVEL)
  })
})

describe("legMistakeFloor", () => {
  it("uses the absolute floor for short legs and the relative floor for long ones", () => {
    expect(legMistakeFloor(100)).toBe(8)
    expect(legMistakeFloor(1000)).toBe(50)
  })
})

describe("computeLegLoss", () => {
  it("flags a leg well above the runner's expected time", () => {
    expect(computeLegLoss(240, 90, 1, 0.15)).toEqual({
      loss: 150,
      hasTimeLoss: true,
      timeLoss: 150,
    })
  })

  it("does not flag a leg within the tolerance band", () => {
    expect(computeLegLoss(100, 90, 1, 0.15)).toEqual({
      loss: 10,
      hasTimeLoss: false,
      timeLoss: 0,
    })
  })

  it("does not flag a slower runner who matches their own expected level", () => {
    expect(computeLegLoss(108, 90, 1.2, 0.15)).toEqual({
      loss: 0,
      hasTimeLoss: false,
      timeLoss: 0,
    })
  })
})

describe("analyzeTimeLoss", () => {
  it("returns empty results when there are no runners", () => {
    const results = analyzeTimeLoss([], 15)
    expect(results.analysisPerControl.size).toBe(0)
    expect(results.globalStats).toEqual({
      totalControls: 0,
      totalSplitsAnalyzed: 0,
      totalTimeLossDetected: 0,
    })
  })

  it("returns empty results when every runner is non-competitive", () => {
    const results = analyzeTimeLoss(
      [makeRunner("nc", cleanLegs, { statusCode: RESULT_STATUS.nc })],
      15,
    )
    expect(results.analysisPerControl.size).toBe(0)
  })

  it("detects the leg where a runner made a real mistake", () => {
    const results = analyzeTimeLoss(buildField(), 15)

    const blunder = getRunnerTimeLossInfo(results, "blunder", "c2")
    expect(blunder).not.toBeNull()
    expect(blunder?.hasTimeLoss).toBe(true)
    expect(blunder?.timeLoss).toBe(150)
    expect(blunder?.splitTime).toBe(240)
    expect(blunder?.rank).toBe(6)
    expect(blunder?.isBest).toBe(false)
  })

  it("does not flag a consistently slower but clean runner on any leg", () => {
    const results = analyzeTimeLoss(buildField(), 15)

    for (const controlId of ["c1", "c2", "c3"]) {
      const info = getRunnerTimeLossInfo(results, "slow", controlId)
      expect(info?.hasTimeLoss).toBe(false)
      expect(info?.timeLoss).toBe(0)
    }
  })

  it("marks the fastest runner on a leg as the best", () => {
    const results = analyzeTimeLoss(buildField(), 15)
    const info = getRunnerTimeLossInfo(results, "r1", "c2")
    expect(info?.isBest).toBe(true)
    expect(info?.rank).toBe(1)
    expect(info?.hasTimeLoss).toBe(false)
  })

  it("gives tied runners on a leg the same rank", () => {
    const legTimes = [10, 20, 30, 30, 50]
    const field = legTimes.map((time, index) =>
      makeRunner(
        `t${index}`,
        [
          { controlId: "tie", time },
          { controlId: "f2", time: 60 },
          { controlId: "f3", time: 60 },
        ],
        { position: index + 1 },
      ),
    )

    const results = analyzeTimeLoss(field, 15)
    expect(getRunnerTimeLossInfo(results, "t2", "tie")?.rank).toBe(3)
    expect(getRunnerTimeLossInfo(results, "t3", "tie")?.rank).toBe(3)
    expect(getRunnerTimeLossInfo(results, "t2", "tie")?.isTopThree).toBe(true)
    expect(getRunnerTimeLossInfo(results, "t3", "tie")?.isTopThree).toBe(true)
    expect(getRunnerTimeLossInfo(results, "t4", "tie")?.rank).toBe(5)
    expect(getRunnerTimeLossInfo(results, "t4", "tie")?.isTopThree).toBe(false)
  })

  it("aggregates global statistics across the field", () => {
    const results = analyzeTimeLoss(buildField(), 15)
    expect(results.globalStats.totalControls).toBe(3)
    expect(results.globalStats.totalSplitsAnalyzed).toBe(18)
    expect(results.globalStats.totalTimeLossDetected).toBe(1)
  })

  it("ignores non-competitive runners when building the leg reference", () => {
    const field = [
      ...buildField(),
      makeRunner(
        "nc",
        [
          { controlId: "c1", time: 60 },
          { controlId: "c2", time: 30 },
          { controlId: "c3", time: 120 },
        ],
        { statusCode: RESULT_STATUS.nc },
      ),
    ]

    const results = analyzeTimeLoss(field, 15)
    expect(results.analysisPerControl.get("c2")?.bestTime).toBe(90)
    expect(getRunnerTimeLossInfo(results, "nc", "c2")).toBeNull()
  })

  it("uses the fastest-quartile average as the leg reference on a full field", () => {
    const bigLegTimes = [40, 96, 98, 100, 102, 104, 106, 108, 110, 260]
    const field = bigLegTimes.map((time, index) =>
      makeRunner(
        `b${index}`,
        [
          { controlId: "big", time },
          { controlId: "f2", time: 60 },
          { controlId: "f3", time: 60 },
        ],
        { position: index + 1 },
      ),
    )

    const bigLeg = analyzeTimeLoss(field, 15).analysisPerControl.get("big")
    expect(bigLeg?.bestTime).toBe(40)
    expect(bigLeg?.estimatedTimeWithoutError).toBe(98)
  })

  it("skips legs that do not have enough runners for a reliable reference", () => {
    const results = analyzeTimeLoss(
      [makeRunner("a", cleanLegs, { position: 1 }), makeRunner("b", cleanLegs, { position: 2 })],
      15,
    )
    expect(results.analysisPerControl.size).toBe(0)
  })

  it("does not create a finish leg when there is no run-in time", () => {
    const results = analyzeTimeLoss(buildField(), 15)
    expect(results.analysisPerControl.has(FINISH_LEG_ID)).toBe(false)
  })

  it("analyses the run-in to the finish as its own leg", () => {
    const field = [
      makeRunner("r1", cleanLegs, { position: 1, runInSeconds: 30 }),
      makeRunner("r2", cleanLegs, { position: 2, runInSeconds: 30 }),
      makeRunner("r3", cleanLegs, { position: 3, runInSeconds: 30 }),
      makeRunner("r4", cleanLegs, { position: 4, runInSeconds: 30 }),
      makeRunner("slowFinish", cleanLegs, { position: 5, runInSeconds: 120 }),
    ]

    const results = analyzeTimeLoss(field, 15)
    const info = getRunnerTimeLossInfo(results, "slowFinish", FINISH_LEG_ID)
    expect(info?.hasTimeLoss).toBe(true)
    expect(info?.timeLoss).toBe(90)
  })

  it("returns null for unknown runners or controls", () => {
    const results = analyzeTimeLoss(buildField(), 15)
    expect(getRunnerTimeLossInfo(results, "ghost", "c2")).toBeNull()
    expect(getRunnerTimeLossInfo(results, "r1", "c99")).toBeNull()
  })
})
