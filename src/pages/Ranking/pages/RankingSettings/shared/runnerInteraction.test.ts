import { describe, expect, it } from "vitest"
import { RUNNER_EXPANDED, runnerLabel, toRunnerInteraction } from "./runnerInteraction.ts"

const runner = { id: "runner-1", full_name: "Ada Lovelace", bib_number: 42 }
const path = "/competitions/event-1/stage-1"

describe("toRunnerInteraction", () => {
  it("extracts the event, the stage and the runner", () => {
    expect(toRunnerInteraction({ type: RUNNER_EXPANDED, path, payload: runner })).toEqual({
      eventId: "event-1",
      stageId: "stage-1",
      runner,
    })
  })

  it("ignores anything that is not a runner expansion", () => {
    expect(toRunnerInteraction(null)).toBeNull()
    expect(toRunnerInteraction({ type: "OTHER", path, payload: runner })).toBeNull()
    expect(toRunnerInteraction({ type: RUNNER_EXPANDED, payload: runner })).toBeNull()
  })

  it("ignores a path without both an event and a stage", () => {
    expect(toRunnerInteraction({ type: RUNNER_EXPANDED, path: "/competitions/event-1" })).toBeNull()
    expect(toRunnerInteraction({ type: RUNNER_EXPANDED, path: "/rankings/event-1" })).toBeNull()
  })

  it("carries no runner when the payload has no name, so the previous one is dropped", () => {
    expect(
      toRunnerInteraction({ type: RUNNER_EXPANDED, path, payload: { id: "runner-2" } }),
    ).toEqual({ eventId: "event-1", stageId: "stage-1", runner: null })
  })
})

describe("runnerLabel", () => {
  it("joins the bib number and the full name", () => {
    expect(runnerLabel(runner)).toBe("42: Ada Lovelace")
  })
})
