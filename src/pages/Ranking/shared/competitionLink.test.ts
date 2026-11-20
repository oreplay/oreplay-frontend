import { describe, expect, it } from "vitest"
import { competitionClassResultsPath, competitionResultsPath } from "./competitionLink.ts"

describe("competitionResultsPath", () => {
  it("points to the public results of the stage", () => {
    expect(competitionResultsPath("evt-1", "stg-1")).toBe("/competitions/evt-1/stg-1")
  })
})

describe("competitionClassResultsPath", () => {
  it("opens the stage results on the given class", () => {
    expect(competitionClassResultsPath("evt-1", "stg-1", "F-21")).toBe(
      "/competitions/evt-1/stg-1?class=F-21",
    )
  })

  it("encodes class names that are not URL safe", () => {
    expect(competitionClassResultsPath("evt-1", "stg-1", "H 35/B")).toBe(
      "/competitions/evt-1/stg-1?class=H+35%2FB",
    )
  })
})
