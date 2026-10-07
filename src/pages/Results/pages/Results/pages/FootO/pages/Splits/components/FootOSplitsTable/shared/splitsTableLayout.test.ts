import { describe, expect, it } from "vitest"
import { countSplitsTableColumns } from "./splitsTableLayout.ts"

describe("countSplitsTableColumns", () => {
  it("counts the time column plus one column per control", () => {
    expect(countSplitsTableColumns(5, false)).toBe(6)
  })

  it("counts the clean time column when it is shown", () => {
    expect(countSplitsTableColumns(5, true)).toBe(7)
  })

  it("keeps the time column when the course has no controls", () => {
    expect(countSplitsTableColumns(0, false)).toBe(1)
  })
})
