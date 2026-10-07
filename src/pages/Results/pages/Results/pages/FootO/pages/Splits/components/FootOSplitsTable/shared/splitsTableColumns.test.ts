import { describe, expect, it } from "vitest"
import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import {
  buildSplitsTableColumns,
  getSplitsTableColumnKey,
  SPLITS_TABLE_COLUMN_KIND,
} from "./splitsTableColumns.ts"

const RADIOS: OnlineControlModel[] = [
  { id: "radio1", station: "31" },
  { id: "radio2", station: "41" },
]

describe("buildSplitsTableColumns", () => {
  it("starts with the time column followed by one column per control", () => {
    const columns = buildSplitsTableColumns(RADIOS, false)

    expect(columns.map((column) => column.kind)).toEqual([
      SPLITS_TABLE_COLUMN_KIND.Time,
      SPLITS_TABLE_COLUMN_KIND.Control,
      SPLITS_TABLE_COLUMN_KIND.Control,
    ])
  })

  it("places the clean time column right after the time column", () => {
    const columns = buildSplitsTableColumns(RADIOS, true)

    expect(columns.map((column) => column.kind)).toEqual([
      SPLITS_TABLE_COLUMN_KIND.Time,
      SPLITS_TABLE_COLUMN_KIND.CleanTime,
      SPLITS_TABLE_COLUMN_KIND.Control,
      SPLITS_TABLE_COLUMN_KIND.Control,
    ])
  })

  it("points each control column at the split in the same position", () => {
    const columns = buildSplitsTableColumns(RADIOS, true)

    expect(columns.slice(2)).toMatchObject([{ splitIndex: 0 }, { splitIndex: 1 }])
  })

  it("keeps only the time column when there are no controls", () => {
    expect(buildSplitsTableColumns([], false)).toHaveLength(1)
  })
})

describe("getSplitsTableColumnKey", () => {
  it("gives every column a different key", () => {
    const keys = buildSplitsTableColumns(RADIOS, true).map(getSplitsTableColumnKey)

    expect(new Set(keys).size).toBe(keys.length)
  })

  it("keeps the key of a control column when the clean time column appears", () => {
    const keysWithoutCleanTime = buildSplitsTableColumns(RADIOS, false).map(getSplitsTableColumnKey)
    const keysWithCleanTime = buildSplitsTableColumns(RADIOS, true).map(getSplitsTableColumnKey)

    expect(keysWithCleanTime).toEqual(expect.arrayContaining(keysWithoutCleanTime))
  })
})
