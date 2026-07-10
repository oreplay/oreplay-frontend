import { describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { buildDuplicateEventBody } from "./duplicateRanking.ts"

describe("buildDuplicateEventBody", () => {
  it("uses the title as description and Jan 1 of the current year for dates", () => {
    const date = `${DateTime.now().year}-01-01`
    expect(buildDuplicateEventBody("Copy")).toEqual({
      description: "Copy",
      initial_date: date,
      final_date: date,
    })
  })
})
