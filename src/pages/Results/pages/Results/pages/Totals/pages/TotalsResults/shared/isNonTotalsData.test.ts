import { describe, expect, it } from "vitest"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { baseTotalsRunnerFixture } from "./totalsFixtures.ts"
import { isNonTotalsData } from "./isNonTotalsData.ts"

const totalsRunner: ProcessedRunnerModel = { ...baseTotalsRunnerFixture, id: "totals-runner" }

const raceRunner: ProcessedRunnerModel = {
  ...baseTotalsRunnerFixture,
  id: "race-runner",
  overalls: null,
}

describe("isNonTotalsData", () => {
  it("flags runners without overall results", () => {
    expect(isNonTotalsData([raceRunner, { ...raceRunner, id: "other-race-runner" }])).toBe(true)
  })

  it("flags a list where only some runners have overall results", () => {
    expect(isNonTotalsData([totalsRunner, raceRunner])).toBe(true)
  })

  it("accepts runners with overall results", () => {
    expect(isNonTotalsData([totalsRunner, { ...totalsRunner, id: "other-totals-runner" }])).toBe(
      false,
    )
  })

  it("accepts an empty list", () => {
    expect(isNonTotalsData([])).toBe(false)
  })
})
