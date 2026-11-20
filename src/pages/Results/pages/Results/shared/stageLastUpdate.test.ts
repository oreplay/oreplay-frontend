import { describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { LastDates } from "../../../../../domain/types/v1api"
import { StageModel } from "../../../../../shared/EntityTypes.ts"
import {
  getStageLastUpdate,
  hasStageStarted,
  isStageLive,
  LIVE_UPDATE_WINDOW,
} from "./stageLastUpdate.ts"

const EARLIER = "2026-10-29T09:00:00.000Z"
const LATER = "2026-10-29T10:00:00.000Z"

/**
 * Builds a stage with the given last dates.
 * @param lastDates When the stage last had each kind of event; absent ones never happened.
 * @returns A stage carrying only what the live status reads.
 */
const stageWithDates = (lastDates: LastDates): StageModel => ({
  id: "stage",
  description: "Sprint",
  external_url: null,
  last_dates: lastDates,
  stage_type: { id: "type", description: "Foot-O, MTBO, Ski-O" },
  start: null,
})

describe("getStageLastUpdate", () => {
  it("returns the date of the latest upload", () => {
    const stage = stageWithDates({ start_list: EARLIER, results: LATER })
    expect(getStageLastUpdate(stage)?.toMillis()).toBe(DateTime.fromISO(LATER).toMillis())
  })

  it("counts a start list uploaded after the results", () => {
    const stage = stageWithDates({ start_list: LATER, results: EARLIER })
    expect(getStageLastUpdate(stage)?.toMillis()).toBe(DateTime.fromISO(LATER).toMillis())
  })

  it("returns null for a stage without uploads", () => {
    expect(getStageLastUpdate(stageWithDates({}))).toBeNull()
  })

  it("returns null when the stage was cleared after its latest upload", () => {
    expect(getStageLastUpdate(stageWithDates({ results: EARLIER, cleared: LATER }))).toBeNull()
  })

  it("returns the upload made after the stage was cleared", () => {
    const stage = stageWithDates({ cleared: EARLIER, results: LATER })
    expect(getStageLastUpdate(stage)?.toMillis()).toBe(DateTime.fromISO(LATER).toMillis())
  })

  it("returns null for an official stage", () => {
    expect(getStageLastUpdate(stageWithDates({ results: EARLIER, final: LATER }))).toBeNull()
  })

  it("returns null when the upload date cannot be parsed", () => {
    expect(getStageLastUpdate(stageWithDates({ results: "not a date" }))).toBeNull()
  })
})

describe("hasStageStarted", () => {
  const start = DateTime.fromISO(EARLIER)

  it("has not started before its start", () => {
    expect(hasStageStarted(EARLIER, start.minus({ minutes: 1 }))).toBe(false)
  })

  it("has started right at its start", () => {
    expect(hasStageStarted(EARLIER, start)).toBe(true)
  })

  it("has started after its start", () => {
    expect(hasStageStarted(EARLIER, start.plus({ minutes: 1 }))).toBe(true)
  })

  it("counts a stage without a start as started", () => {
    expect(hasStageStarted(null, start)).toBe(true)
    expect(hasStageStarted(undefined, start)).toBe(true)
  })

  it("counts a stage whose start cannot be parsed as started", () => {
    expect(hasStageStarted("not a date", start)).toBe(true)
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
