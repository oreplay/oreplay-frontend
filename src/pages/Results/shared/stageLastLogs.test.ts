import { describe, expect, it } from "vitest"
import {
  Data,
  EventDetailModel,
  StageModel,
  StateLog,
  StateLogConst,
} from "../../../shared/EntityTypes.ts"
import { withStageLastLogs } from "./stageLastLogs.ts"

const STAGE_ID = "stage-1"
const OTHER_STAGE_ID = "stage-2"
const UPLOADED: StateLog = { state: StateLogConst.RESULT, created: "2026-10-29T09:00:00.000Z" }
const UPLOADED_AGAIN: StateLog = {
  state: StateLogConst.RESULT,
  created: "2026-10-29T10:00:00.000Z",
}

/**
 * Builds a stage with the given state logs.
 * @param id Stage id.
 * @param logs State logs, oldest first.
 * @returns A stage carrying only what the tests read.
 */
const buildStage = (id: string, logs: StateLog[]): StageModel => ({
  id,
  description: "Sprint",
  external_url: null,
  last_logs: logs,
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

describe("withStageLastLogs", () => {
  it("replaces the logs of the given stage", () => {
    const event = buildEvent([buildStage(STAGE_ID, [UPLOADED])])
    const updated = withStageLastLogs(event, STAGE_ID, [UPLOADED, UPLOADED_AGAIN])
    expect(updated.data.stages[0].last_logs).toEqual([UPLOADED, UPLOADED_AGAIN])
  })

  it("leaves the other stages untouched", () => {
    const otherStage = buildStage(OTHER_STAGE_ID, [UPLOADED])
    const event = buildEvent([buildStage(STAGE_ID, [UPLOADED]), otherStage])
    const updated = withStageLastLogs(event, STAGE_ID, [UPLOADED_AGAIN])
    expect(updated.data.stages[1]).toBe(otherStage)
  })

  it("does not mutate the given event", () => {
    const event = buildEvent([buildStage(STAGE_ID, [UPLOADED])])
    withStageLastLogs(event, STAGE_ID, [UPLOADED_AGAIN])
    expect(event.data.stages[0].last_logs).toEqual([UPLOADED])
  })

  it("returns the same event when the logs did not change", () => {
    const event = buildEvent([buildStage(STAGE_ID, [UPLOADED])])
    expect(withStageLastLogs(event, STAGE_ID, [{ ...UPLOADED }])).toBe(event)
  })

  it("returns the same event when the stage is not in it", () => {
    const event = buildEvent([buildStage(OTHER_STAGE_ID, [UPLOADED])])
    expect(withStageLastLogs(event, STAGE_ID, [UPLOADED_AGAIN])).toBe(event)
  })
})
