import { describe, expect, it } from "vitest"
import { getOfficialChipDimensions, OFFICIAL_CHIP_SIZE } from "./officialChipSizes.ts"

describe("getOfficialChipDimensions", () => {
  it("gives the regular chip its standalone measurements", () => {
    expect(getOfficialChipDimensions(OFFICIAL_CHIP_SIZE.Regular)).toEqual({
      heightPx: 28,
      iconPx: 18,
      labelPx: 13,
      paddingLeftPx: 8,
      paddingRightPx: 12,
      gapPx: 6,
    })
  })

  it("gives the compact chip smaller measurements for table rows", () => {
    expect(getOfficialChipDimensions(OFFICIAL_CHIP_SIZE.Compact)).toEqual({
      heightPx: 18,
      iconPx: 12,
      labelPx: 11,
      paddingLeftPx: 4,
      paddingRightPx: 6,
      gapPx: 3,
    })
  })
})
