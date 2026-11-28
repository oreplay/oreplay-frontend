import { describe, expect, it } from "vitest"
import { RunnerSearch } from "../../../../../domain/types/v1api"
import { ORGANIZER_RANKING_STATUSES } from "./organizerRankingStatus.ts"
import { needsRunnerMatches, toReplacementOrganizerBody } from "./organizerRunnerMatches.ts"

const runner: RunnerSearch = {
  class: { id: "class-1", long_name: "Hombres 35", short_name: "H-35" },
  first_name: "Felipe",
  id: "runner-2",
  last_name: "Peña Pita",
}

describe("needsRunnerMatches", () => {
  it("searches for matches only for an organizer missing from the ranking", () => {
    const searched = ORGANIZER_RANKING_STATUSES.filter(needsRunnerMatches)
    expect(searched).toEqual(["missing"])
  })
})

describe("toReplacementOrganizerBody", () => {
  it("links the matched runner and keeps the organizer description", () => {
    expect(toReplacementOrganizerBody({ description: "Course setter" }, runner)).toEqual({
      first_name: "Felipe",
      last_name: "Peña Pita",
      description: "Course setter",
      runner_id: "runner-2",
    })
  })

  it("omits an empty description", () => {
    expect(toReplacementOrganizerBody({ description: null }, runner).description).toBeUndefined()
  })
})
