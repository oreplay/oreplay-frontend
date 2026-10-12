import { describe, expect, it } from "vitest"
import { getEventPath } from "./eventPath.ts"

describe("getEventPath", () => {
  it("points at the event page", () => {
    expect(getEventPath("event-1")).toBe("/competitions/event-1")
  })
})
