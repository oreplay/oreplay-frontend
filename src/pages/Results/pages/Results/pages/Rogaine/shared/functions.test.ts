import { describe, it, expect } from "vitest"
import { DateTime } from "luxon"
import { RunnerModel, SplitModel, TeamRunner } from "../../../../../../../shared/EntityTypes.ts"
import { copySplitsFromRunnerToTeam } from "./functions.ts"

/**
 * Builds a minimal SplitModel for a given control id and reading time.
 */
function buildSplit(controlId: string, readingTime: string | null): SplitModel {
  return {
    id: `split-${controlId}-${readingTime}`,
    is_intermediate: true,
    reading_time: readingTime,
    order_number: null,
    points: null,
    control: {
      id: controlId,
      station: controlId,
      control_type: { id: "ct-1", description: "Control" },
    },
  }
}

/**
 * Builds a minimal TeamRunner with the given splits.
 */
function buildTeamRunner(id: string, legNumber: number, splits: SplitModel[]): TeamRunner {
  return {
    id,
    full_name: `Runner ${id}`,
    bib_number: id,
    is_nc: false,
    eligibility: null,
    leg_number: legNumber,
    club: null,
    class: null,
    overalls: null,
    stage: {
      id: `stage-${id}`,
      result_type_id: "result-type-1",
      start_time: null,
      finish_time: null,
      upload_type: "res_splits",
      time_seconds: 0,
      position: 1,
      status_code: null,
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
      splits,
    },
  }
}

/**
 * Builds a minimal RunnerModel. Pass `runners: null` to represent an individual
 * (non-team) runner, or a list of TeamRunners to represent a team.
 */
function buildRunnerModel(runners: TeamRunner[] | null, ownSplits: SplitModel[] = []): RunnerModel {
  return {
    id: "runner-1",
    full_name: "Runner 1",
    bib_number: "T1",
    is_nc: false,
    eligibility: null,
    club: null,
    class: { id: "class-1", short_name: "C1", long_name: "Class 1" },
    overalls: null,
    stage: {
      id: "stage-1",
      result_type_id: "result-type-1",
      start_time: null,
      finish_time: null,
      upload_type: "res_splits",
      time_seconds: 0,
      position: 1,
      status_code: null,
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
      splits: ownSplits,
    },
    runners,
  }
}

describe("copySplitsFromRunnerToTeam", () => {
  it("does nothing if runner is not a team", () => {
    // An individual runner has no `runners` at all — isTeam should be false.
    const runner = buildRunnerModel(null, [])

    copySplitsFromRunnerToTeam(runner)

    expect(runner.stage.splits).toEqual([])
  })

  it("does nothing if the team's stage already has splits", () => {
    const existingSplit = buildSplit("existing", "2024-01-01T09:00:00.000Z")
    const runner = buildRunnerModel(
      [buildTeamRunner("r1", 1, [buildSplit("c1", "2024-01-01T10:00:00.000Z")])],
      [existingSplit],
    )

    copySplitsFromRunnerToTeam(runner)

    expect(runner.stage.splits).toEqual([existingSplit])
  })

  it("does nothing if there are no team runners", () => {
    const runner = buildRunnerModel([])

    copySplitsFromRunnerToTeam(runner)

    expect(runner.stage.splits).toEqual([])
  })

  it("creates a combined split using the max reading time when all runners have a matching control", () => {
    const runner1 = buildTeamRunner("r1", 1, [buildSplit("c1", "2024-01-01T10:00:00.000Z")])
    const runner2 = buildTeamRunner("r2", 2, [buildSplit("c1", "2024-01-01T10:00:30.000Z")])

    const runner = buildRunnerModel([runner1, runner2])

    copySplitsFromRunnerToTeam(runner)

    expect(runner.stage.splits).toHaveLength(1)
    expect(runner.stage.splits[0].control?.id).toBe("c1")
    expect(runner.stage.splits[0].reading_time).toBe(
      DateTime.fromISO("2024-01-01T10:00:30.000Z").toISO(),
    )
    expect(runner.stage.splits[0].order_number).toBe(1)
    expect(runner.stage.splits[0].points).toBeNull()
  })

  it("skips a control if not every team runner has a matching split", () => {
    const runner1 = buildTeamRunner("r1", 1, [
      buildSplit("c1", "2024-01-01T10:00:00.000Z"),
      buildSplit("c2", "2024-01-01T10:05:00.000Z"),
    ])
    const runner2 = buildTeamRunner("r2", 2, [buildSplit("c1", "2024-01-01T10:00:30.000Z")])

    const runner = buildRunnerModel([runner1, runner2])

    copySplitsFromRunnerToTeam(runner)

    expect(runner.stage.splits).toHaveLength(1)
    expect(runner.stage.splits[0].control?.id).toBe("c1")
  })

  it("skips a control if a matching split has a null reading time", () => {
    const runner1 = buildTeamRunner("r1", 1, [buildSplit("c1", null)])
    const runner2 = buildTeamRunner("r2", 2, [buildSplit("c1", "2024-01-01T10:00:30.000Z")])

    const runner = buildRunnerModel([runner1, runner2])

    copySplitsFromRunnerToTeam(runner)

    expect(runner.stage.splits).toHaveLength(0)
  })

  it("skips a control if reading times differ by more than the allowed threshold", () => {
    const runner1 = buildTeamRunner("r1", 1, [buildSplit("c1", "2024-01-01T10:00:00.000Z")])
    const runner2 = buildTeamRunner("r2", 2, [buildSplit("c1", "2024-01-01T10:05:00.000Z")]) // 5 min apart

    const runner = buildRunnerModel([runner1, runner2])

    copySplitsFromRunnerToTeam(runner)

    expect(runner.stage.splits).toHaveLength(0)
  })

  it("includes a control if reading times differ by exactly the allowed threshold", () => {
    const runner1 = buildTeamRunner("r1", 1, [buildSplit("c1", "2024-01-01T10:00:00.000Z")])
    const runner2 = buildTeamRunner("r2", 2, [buildSplit("c1", "2024-01-01T10:01:00.000Z")]) // 60s apart

    const runner = buildRunnerModel([runner1, runner2])

    copySplitsFromRunnerToTeam(runner)

    expect(runner.stage.splits).toHaveLength(1)
  })

  it("orders combined splits by reading time and assigns sequential order_number", () => {
    const runner1 = buildTeamRunner("r1", 1, [
      buildSplit("c1", "2024-01-01T10:10:00.000Z"),
      buildSplit("c2", "2024-01-01T10:00:00.000Z"),
    ])
    const runner2 = buildTeamRunner("r2", 2, [
      buildSplit("c1", "2024-01-01T10:10:10.000Z"),
      buildSplit("c2", "2024-01-01T10:00:10.000Z"),
    ])

    const runner = buildRunnerModel([runner1, runner2])

    copySplitsFromRunnerToTeam(runner)

    expect(runner.stage.splits).toHaveLength(2)
    expect(runner.stage.splits[0].control?.id).toBe("c2")
    expect(runner.stage.splits[0].order_number).toBe(1)
    expect(runner.stage.splits[1].control?.id).toBe("c1")
    expect(runner.stage.splits[1].order_number).toBe(2)
  })
})
