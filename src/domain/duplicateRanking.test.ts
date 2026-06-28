import { describe, expect, it } from "vitest"
import { buildDuplicateEventBody } from "./duplicateRanking.ts"

describe("buildDuplicateEventBody", () => {
  it("uses the title as description and Jan 1 of the current year for dates", () => {
    const date = `${new Date().getFullYear()}-01-01`
    expect(buildDuplicateEventBody("Copy")).toEqual({
      description: "Copy",
      initial_date: date,
      final_date: date,
    })
  })
})
