import { describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { EVENT_NOT_PUBLIC, buildRankingEventBody } from "./rankingCreation.ts"

describe("buildRankingEventBody", () => {
  it("uses the title as description, Jan 1 of the current year for dates, and is never public", () => {
    const date = `${DateTime.now().year}-01-01`
    expect(buildRankingEventBody("Copy")).toEqual({
      description: "Copy",
      initial_date: date,
      final_date: date,
      is_hidden: EVENT_NOT_PUBLIC,
    })
  })
})
