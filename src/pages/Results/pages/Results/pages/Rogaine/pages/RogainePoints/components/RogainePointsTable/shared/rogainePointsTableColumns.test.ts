import { describe, expect, it } from "vitest"
import {
  buildRogainePointsTableColumns,
  getRogainePointsTableColumnKey,
  ROGAINE_POINTS_TABLE_COLUMN_KIND,
} from "./rogainePointsTableColumns.ts"

describe("buildRogainePointsTableColumns", () => {
  it("starts with the bonus, penalty, points and time columns", () => {
    const columns = buildRogainePointsTableColumns([])

    expect(columns.map((column) => column.kind)).toEqual([
      ROGAINE_POINTS_TABLE_COLUMN_KIND.Bonus,
      ROGAINE_POINTS_TABLE_COLUMN_KIND.Penalty,
      ROGAINE_POINTS_TABLE_COLUMN_KIND.Points,
      ROGAINE_POINTS_TABLE_COLUMN_KIND.Time,
    ])
  })

  it("adds one column per control, in the given order", () => {
    const columns = buildRogainePointsTableColumns([31n, 41n])

    expect(columns.slice(4)).toEqual([
      { kind: ROGAINE_POINTS_TABLE_COLUMN_KIND.Control, station: 31n },
      { kind: ROGAINE_POINTS_TABLE_COLUMN_KIND.Control, station: 41n },
    ])
  })
})

describe("getRogainePointsTableColumnKey", () => {
  it("is the kind of a score column", () => {
    expect(getRogainePointsTableColumnKey({ kind: ROGAINE_POINTS_TABLE_COLUMN_KIND.Bonus })).toBe(
      ROGAINE_POINTS_TABLE_COLUMN_KIND.Bonus,
    )
  })

  it("tells the control columns apart by their station", () => {
    const keys = buildRogainePointsTableColumns([31n, 41n]).map(getRogainePointsTableColumnKey)

    expect(new Set(keys).size).toBe(keys.length)
  })
})
