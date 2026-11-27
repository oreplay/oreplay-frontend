import { describe, expect, it } from "vitest"
import { getControlPath, getEventPath, getStagePath } from "./eventPath.ts"

describe("getControlPath", () => {
  it("points at the control page of the stage", () => {
    expect(getControlPath("event-1", "stage-1", "42")).toBe(
      "/competitions/event-1/stage-1/control/42",
    )
  })
})

describe("getEventPath", () => {
  it("points at the event page", () => {
    expect(getEventPath("event-1")).toBe("/competitions/event-1")
  })
})

describe("getStagePath", () => {
  it("points at the stage results page", () => {
    expect(getStagePath("event-1", "stage-1")).toBe("/competitions/event-1/stage-1")
  })
})
