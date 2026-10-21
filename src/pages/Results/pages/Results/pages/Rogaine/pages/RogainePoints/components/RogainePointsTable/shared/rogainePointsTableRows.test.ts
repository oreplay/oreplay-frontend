import { describe, expect, it } from "vitest"
import { buildRogaineRunnerFixture } from "./rogainePointsTableFixtures.ts"
import {
  buildRogainePointsTableRows,
  getRogainePointsTableRowKey,
  isStationPunched,
} from "./rogainePointsTableRows.ts"

describe("buildRogainePointsTableRows", () => {
  it("builds one row per runner, keeping their order", () => {
    const runners = [buildRogaineRunnerFixture("anna"), buildRogaineRunnerFixture("bea")]

    const rows = buildRogainePointsTableRows(runners)

    expect(rows.map((row) => row.runner)).toEqual(runners)
  })

  it("collects the stations each runner punched", () => {
    const [row] = buildRogainePointsTableRows([
      buildRogaineRunnerFixture("anna", { stations: ["41", "31", "41"] }),
    ])

    expect(row.punchedStations).toEqual([31n, 41n])
  })
})

describe("getRogainePointsTableRowKey", () => {
  it("is the id of the runner", () => {
    const [row] = buildRogainePointsTableRows([buildRogaineRunnerFixture("anna")])

    expect(getRogainePointsTableRowKey(row)).toBe("anna")
  })
})

describe("isStationPunched", () => {
  const [row] = buildRogainePointsTableRows([
    buildRogaineRunnerFixture("anna", { stations: ["31"] }),
  ])

  it("is true for a punched station", () => {
    expect(isStationPunched(row, 31n)).toBe(true)
  })

  it("is false for a station the runner skipped", () => {
    expect(isStationPunched(row, 41n)).toBe(false)
  })
})
