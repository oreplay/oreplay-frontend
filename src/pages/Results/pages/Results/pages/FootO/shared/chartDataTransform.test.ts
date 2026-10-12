import { describe, it, expect } from "vitest"
import { TFunction } from "i18next"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../../../../shared/constants.ts"
import { UPLOAD_TYPES } from "../../../shared/constants.ts"
import {
  computeLegAxisPositions,
  computeLegAxisWidths,
  computePerfectRunnerTimes,
  EVEN_LEG_AXIS_WIDTH,
  getLineChartTicks,
  LINE_CHART_REFERENCE,
  MIN_LEG_AXIS_WIDTH_RATIO,
  START_AXIS_POSITION,
  START_CONTROL_ID,
  transformRunnersForLineChart,
  transformRunnersForPositionChart,
} from "./chartDataTransform.ts"
import { computeBestLegTimes, computeLegReferences, FINISH_LEG_ID } from "./timeLossAnalysis.ts"

const translate = ((key: string) => key) as unknown as TFunction

const makeRunner = (
  id: string,
  legTimes: number[],
  runInSeconds: number,
  statusCode: string = RESULT_STATUS.ok,
  controlIds: string[] = legTimes.map((_, index) => `c${index + 1}`),
): ProcessedRunnerModel => {
  let cumulative = 0
  const splits = legTimes.map((time, index) => {
    cumulative += time
    return {
      id: `${id}-s${index + 1}`,
      is_intermediate: true,
      reading_time: null,
      order_number: index + 1,
      points: null,
      control: {
        id: controlIds[index],
        station: `${31 + index}`,
        control_type: { id: "normal", description: "Normal control" },
      },
      time,
      time_behind: null,
      position: null,
      cumulative_time: cumulative,
      cumulative_behind: 0,
      cumulative_position: index + 2,
    }
  })

  return {
    id,
    full_name: id,
    bib_number: id,
    is_nc: statusCode === RESULT_STATUS.nc,
    eligibility: null,
    sicard: null,
    club: null,
    class: { id: "class", short_name: "C", long_name: "Class" },
    stage: {
      id: `${id}-stage`,
      result_type_id: "result-type",
      start_time: "2025-06-27T09:00:00.000+00:00",
      finish_time: "2025-06-27T09:10:00.000+00:00",
      upload_type: UPLOAD_TYPES.SPLIT_RESULT,
      time_seconds: cumulative + runInSeconds,
      position: 1,
      status_code: statusCode,
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

describe("computeLegReferences", () => {
  it("uses the best leg time when only a few runners have it", () => {
    const runners = [makeRunner("r1", [60, 120], 15), makeRunner("r2", [70, 100], 12)]

    const references = computeLegReferences(runners)

    expect(references.get("c1")).toBe(60)
    expect(references.get("c2")).toBe(100)
    expect(references.get(FINISH_LEG_ID)).toBe(12)
  })

  it("ignores an outlier fastest time in a large field", () => {
    const runners = [
      makeRunner("outsider", [10], 15),
      ...[60, 62, 64, 66, 80, 90, 100, 110].map((time, index) =>
        makeRunner(`r${index}`, [time], 15),
      ),
    ]

    expect(computeLegReferences(runners).get("c1")).toBe(62)
  })
})

describe("computeLegAxisWidths", () => {
  it("keeps legs proportional to their reference time", () => {
    expect(computeLegAxisWidths([60, 120, 180])).toEqual([60, 120, 180])
  })

  it("never goes below the minimum share of the average leg", () => {
    const [, , finishSprintWidth] = computeLegAxisWidths([120, 120, 6])

    expect(finishSprintWidth).toBe(((120 + 120 + 6) / 3) * MIN_LEG_AXIS_WIDTH_RATIO)
  })

  it("uses the average leg for legs without a reference time", () => {
    expect(computeLegAxisWidths([60, undefined, 120])).toEqual([60, 90, 120])
  })

  it("spaces legs evenly when there is no reference time at all", () => {
    expect(computeLegAxisWidths([undefined, undefined])).toEqual([
      EVEN_LEG_AXIS_WIDTH,
      EVEN_LEG_AXIS_WIDTH,
    ])
  })
})

describe("computeLegAxisPositions", () => {
  it("places each control at the accumulated reference time, finish included", () => {
    const runners = [makeRunner("r1", [60, 120], 60), makeRunner("r2", [80, 140], 70)]

    const positions = computeLegAxisPositions(runners)

    expect(positions.get(START_CONTROL_ID)).toBe(START_AXIS_POSITION)
    expect(positions.get("1")).toBe(60)
    expect(positions.get("2")).toBe(180)
    expect(positions.get(FINISH_LEG_ID)).toBe(240)
  })

  it("gives a control visited twice one position per visit", () => {
    const repeatedCourse = ["c1", "c2", "c1"]
    const runners = [
      makeRunner("r1", [60, 120, 30], 20, RESULT_STATUS.ok, repeatedCourse),
      makeRunner("r2", [80, 140, 40], 25, RESULT_STATUS.ok, repeatedCourse),
    ]

    const positions = computeLegAxisPositions(runners)

    expect(positions.get("1")).toBe(60)
    expect(positions.get("3")).toBe(210)
  })
})

describe("transformRunnersForLineChart", () => {
  it("positions the points on the proportional axis and labels them", () => {
    const runners = [makeRunner("r1", [60, 120], 60), makeRunner("r2", [80, 140], 70)]

    const [series] = transformRunnersForLineChart(runners, ["r1"], translate)

    expect(series.data.map((point) => [point.x, point.xLabel])).toEqual([
      [0, "Graphs.Start"],
      [60, "1"],
      [180, "2"],
      [240, "Graphs.Finish"],
    ])
  })
})

describe("computeBestLegTimes", () => {
  it("keeps the fastest time of every leg, the finish leg included", () => {
    const runners = [makeRunner("r1", [60, 120], 15), makeRunner("r2", [70, 100], 12)]

    const bestLegTimes = computeBestLegTimes(runners)

    expect(bestLegTimes.get("c1")).toBe(60)
    expect(bestLegTimes.get("c2")).toBe(100)
    expect(bestLegTimes.get(FINISH_LEG_ID)).toBe(12)
  })

  it("ignores the legs of runners that are not competing", () => {
    const runners = [makeRunner("r1", [60], 15), makeRunner("nc", [50], 10, RESULT_STATUS.nc)]

    const bestLegTimes = computeBestLegTimes(runners)

    expect(bestLegTimes.get("c1")).toBe(60)
    expect(bestLegTimes.get(FINISH_LEG_ID)).toBe(15)
  })
})

describe("computePerfectRunnerTimes", () => {
  it("adds up the best time of every leg in course order", () => {
    const runners = [makeRunner("r1", [60, 120], 15), makeRunner("r2", [70, 100], 12)]

    const perfectRunnerTimes = computePerfectRunnerTimes(runners)

    expect([...perfectRunnerTimes.entries()]).toEqual([
      ["1", 60],
      ["2", 160],
      [FINISH_LEG_ID, 172],
    ])
  })
})

describe("transformRunnersForLineChart behind the perfect runner", () => {
  const runners = [makeRunner("r1", [60, 120], 15), makeRunner("r2", [70, 100], 12)]

  it("plots the time behind the perfect runner at every control", () => {
    const [first, second] = transformRunnersForLineChart(
      runners,
      ["r1", "r2"],
      translate,
      LINE_CHART_REFERENCE.PerfectRunner,
    )

    expect(first.data.map((point) => point.y)).toEqual([0, 0, 20, 23])
    expect(second.data.map((point) => point.y)).toEqual([0, 10, 10, 10])
  })

  it("spaces the controls like the time behind leader graph", () => {
    const [behindLeader] = transformRunnersForLineChart(runners, ["r1"], translate)
    const [behindPerfectRunner] = transformRunnersForLineChart(
      runners,
      ["r1"],
      translate,
      LINE_CHART_REFERENCE.PerfectRunner,
    )

    expect(behindPerfectRunner.data.map((point) => point.x)).toEqual(
      behindLeader.data.map((point) => point.x),
    )
  })

  it("keeps plotting the time behind the leader by default", () => {
    const [series] = transformRunnersForLineChart(runners, ["r1"], translate)

    expect(series.data.map((point) => point.y)).toEqual(
      series.data.map((point) => point.timeBehindLeader),
    )
  })

  it("carries the time behind the perfect runner on every point for the tooltip", () => {
    const [series] = transformRunnersForLineChart(runners, ["r2"], translate)

    expect(series.data.map((point) => point.timeBehindPerfectRunner)).toEqual([0, 10, 10, 10])
  })
})

describe("transformRunnersForLineChart with repeated controls", () => {
  it("keeps every visit in course order", () => {
    const repeatedCourse = ["c1", "c2", "c1"]
    const runners = [
      makeRunner("r1", [60, 120, 30], 30, RESULT_STATUS.ok, repeatedCourse),
      makeRunner("r2", [80, 140, 40], 35, RESULT_STATUS.ok, repeatedCourse),
    ]

    const [series] = transformRunnersForLineChart(runners, ["r1"], translate)

    expect(series.data.map((point) => [point.x, point.xLabel])).toEqual([
      [0, "Graphs.Start"],
      [60, "1"],
      [180, "2"],
      [210, "3"],
      [240, "Graphs.Finish"],
    ])
  })
})

describe("getLineChartTicks", () => {
  it("returns one sorted tick per axis position shared by every series", () => {
    const runners = [makeRunner("r1", [60, 120], 60), makeRunner("r2", [80, 140], 70)]
    const series = transformRunnersForLineChart(runners, ["r1", "r2"], translate)

    expect(getLineChartTicks(series)).toEqual([
      { value: 0, label: "Graphs.Start" },
      { value: 60, label: "1" },
      { value: 180, label: "2" },
      { value: 240, label: "Graphs.Finish" },
    ])
  })
})

describe("transformRunnersForPositionChart", () => {
  it("starts at the first control instead of a shared start position", () => {
    const repeatedCourse = ["c1", "c2", "c1"]
    const runners = [makeRunner("r1", [60, 120, 30], 30, RESULT_STATUS.ok, repeatedCourse)]

    const [series] = transformRunnersForPositionChart(runners, ["r1"], translate)

    expect(series.data.map((point) => [point.xLabel, point.controlName, point.y])).toEqual([
      ["1", "31", 2],
      ["2", "32", 3],
      ["3", "33", 4],
      ["Graphs.Finish", "Graphs.Finish", 1],
    ])
  })

  it("spaces the controls by the reference time of their leg, like the line charts", () => {
    const runners = [makeRunner("r1", [60, 120, 30], 30)]

    const [positionSeries] = transformRunnersForPositionChart(runners, ["r1"], translate)
    const [lineSeries] = transformRunnersForLineChart(runners, ["r1"], translate)

    expect(positionSeries.data.map((point) => point.x)).toEqual(
      lineSeries.data.slice(1).map((point) => point.x),
    )
  })
})
