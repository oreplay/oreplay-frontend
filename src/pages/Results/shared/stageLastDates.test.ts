import { describe, expect, it } from "vitest"
import { LastDates } from "../../../domain/types/v1api"
import { Data, EventDetailModel, StageModel } from "../../../shared/EntityTypes.ts"
import { withStageLastDates } from "./stageLastDates.ts"

const STAGE_ID = "stage-1"
const OTHER_STAGE_ID = "stage-2"
const UPLOADED: LastDates = { results: "2026-10-29T09:00:00.000Z" }
const UPLOADED_AGAIN: LastDates = { results: "2026-10-29T10:00:00.000Z" }

/**
 * Builds a stage with the given last dates.
 * @param id Stage id.
 * @param lastDates When the stage last had each kind of event.
 * @returns A stage carrying only what the tests read.
 */
const buildStage = (id: string, lastDates: LastDates): StageModel => ({
  id,
  description: "Sprint",
  external_url: null,
  last_dates: lastDates,
  stage_type: { id: "type", description: "Foot-O, MTBO, Ski-O" },
  start: null,
})

/**
 * Builds an event detail response holding the given stages.
 * @param stages The event's stages.
 * @returns The response, with only the stages being meaningful.
 */
const buildEvent = (stages: StageModel[]): Data<EventDetailModel> => ({
  data: { stages } as EventDetailModel,
})

describe("withStageLastDates", () => {
  it("replaces the dates of the given stage", () => {
    const event = buildEvent([buildStage(STAGE_ID, UPLOADED)])
    const updated = withStageLastDates(event, STAGE_ID, UPLOADED_AGAIN)
    expect(updated.data.stages[0].last_dates).toEqual(UPLOADED_AGAIN)
  })

  it("leaves the other stages untouched", () => {
    const otherStage = buildStage(OTHER_STAGE_ID, UPLOADED)
    const event = buildEvent([buildStage(STAGE_ID, UPLOADED), otherStage])
    const updated = withStageLastDates(event, STAGE_ID, UPLOADED_AGAIN)
    expect(updated.data.stages[1]).toBe(otherStage)
  })

  it("does not mutate the given event", () => {
    const event = buildEvent([buildStage(STAGE_ID, UPLOADED)])
    withStageLastDates(event, STAGE_ID, UPLOADED_AGAIN)
    expect(event.data.stages[0].last_dates).toEqual(UPLOADED)
  })

  it("returns the same event when the dates did not change", () => {
    const event = buildEvent([buildStage(STAGE_ID, UPLOADED)])
    expect(withStageLastDates(event, STAGE_ID, { ...UPLOADED })).toBe(event)
  })

  it("treats a null date like an absent one", () => {
    const event = buildEvent([buildStage(STAGE_ID, UPLOADED)])
    expect(withStageLastDates(event, STAGE_ID, { ...UPLOADED, final: null })).toBe(event)
  })

  it("returns the same event when the stage is not in it", () => {
    const event = buildEvent([buildStage(OTHER_STAGE_ID, UPLOADED)])
    expect(withStageLastDates(event, STAGE_ID, UPLOADED_AGAIN)).toBe(event)
  })
})
