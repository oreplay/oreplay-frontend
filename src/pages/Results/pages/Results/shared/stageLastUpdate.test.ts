import { describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { StageModel, StateLog, StateLogConst } from "../../../../../shared/EntityTypes.ts"
import { getStageLastUpdate, isStageLive, LIVE_UPDATE_WINDOW } from "./stageLastUpdate.ts"

const EARLIER = "2026-10-29T09:00:00.000Z"
const LATER = "2026-10-29T10:00:00.000Z"

/**
 * Builds a stage with the given state logs.
 * @param logs State logs, oldest first.
 * @returns A stage carrying only what the live status reads.
 */
const stageWithLogs = (logs: StateLog[]): StageModel => ({
  id: "stage",
  description: "Sprint",
  external_url: null,
  last_logs: logs,
  stage_type: { id: "type", description: "Foot-O, MTBO, Ski-O" },
  start: null,
})

describe("getStageLastUpdate", () => {
  it("returns the date of the latest log", () => {
    const stage = stageWithLogs([
      { state: StateLogConst.START, created: EARLIER },
      { state: StateLogConst.RESULT, created: LATER },
    ])
    expect(getStageLastUpdate(stage)?.toMillis()).toBe(DateTime.fromISO(LATER).toMillis())
  })

  it("returns null for a stage without logs", () => {
    expect(getStageLastUpdate(stageWithLogs([]))).toBeNull()
  })

  it("returns null when the latest log clears the stage", () => {
    const stage = stageWithLogs([
      { state: StateLogConst.RESULT, created: EARLIER },
      { state: StateLogConst.CLEAR, created: LATER },
    ])
    expect(getStageLastUpdate(stage)).toBeNull()
  })

  it("returns null for an official stage", () => {
    const stage = stageWithLogs([
      { state: StateLogConst.RESULT, created: EARLIER },
      { state: StateLogConst.ENDED, created: LATER },
    ])
    expect(getStageLastUpdate(stage)).toBeNull()
  })

  it("returns null when the log date cannot be parsed", () => {
    expect(
      getStageLastUpdate(stageWithLogs([{ state: StateLogConst.RESULT, created: "not a date" }])),
    ).toBeNull()
  })
})

describe("isStageLive", () => {
  const lastUpdate = DateTime.fromISO(LATER)

  it("is live right after an update", () => {
    expect(isStageLive(lastUpdate, lastUpdate.plus({ minutes: 1 }))).toBe(true)
  })

  it("stops being live once the window has passed", () => {
    expect(isStageLive(lastUpdate, lastUpdate.plus(LIVE_UPDATE_WINDOW))).toBe(false)
  })

  it("counts an update dated in the future as live", () => {
    expect(isStageLive(lastUpdate, lastUpdate.minus({ minutes: 1 }))).toBe(true)
  })
})
