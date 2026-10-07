import { describe, expect, it } from "vitest"
import {
  availableSplitsViews,
  defaultSplitsView,
  showsTimeLoss,
  SPLITS_VIEW,
  SPLITS_VIEW_CONFIG,
  splitsViewOptionId,
} from "./splitsViews.ts"

describe("availableSplitsViews", () => {
  it("offers the radios view first when the class has radios", () => {
    expect(availableSplitsViews(true)).toEqual([
      SPLITS_VIEW.Radios,
      SPLITS_VIEW.Splits,
      SPLITS_VIEW.Accumulated,
    ])
  })

  it("hides the radios view when the class has no radios", () => {
    expect(availableSplitsViews(false)).toEqual([SPLITS_VIEW.Splits, SPLITS_VIEW.Accumulated])
  })
})

describe("defaultSplitsView", () => {
  it("starts on radios when the class has radios", () => {
    expect(defaultSplitsView(true)).toBe(SPLITS_VIEW.Radios)
  })

  it("starts on splits when the class has no radios", () => {
    expect(defaultSplitsView(false)).toBe(SPLITS_VIEW.Splits)
  })
})

describe("SPLITS_VIEW_CONFIG", () => {
  it("only accumulates times on the accumulated view", () => {
    expect(SPLITS_VIEW_CONFIG[SPLITS_VIEW.Accumulated].showCumulative).toBe(true)
    expect(SPLITS_VIEW_CONFIG[SPLITS_VIEW.Splits].showCumulative).toBe(false)
  })

  it("shows radios without requiring a chip download", () => {
    expect(SPLITS_VIEW_CONFIG[SPLITS_VIEW.Radios]).toMatchObject({
      onlyRadios: true,
      requiresChipDownload: false,
    })
  })
})

describe("showsTimeLoss", () => {
  it("shows the time loss on the splits view when it is switched on", () => {
    expect(showsTimeLoss(SPLITS_VIEW.Splits, true)).toBe(true)
  })

  it("shows the time loss on the accumulated view when it is switched on", () => {
    expect(showsTimeLoss(SPLITS_VIEW.Accumulated, true)).toBe(true)
  })

  it("never shows the time loss on the radios view", () => {
    expect(showsTimeLoss(SPLITS_VIEW.Radios, true)).toBe(false)
  })

  it("hides the time loss when it is switched off", () => {
    expect(showsTimeLoss(SPLITS_VIEW.Splits, false)).toBe(false)
  })
})

describe("splitsViewOptionId", () => {
  it("gives every view a different element id", () => {
    const ids = Object.values(SPLITS_VIEW).map(splitsViewOptionId)

    expect(new Set(ids).size).toBe(ids.length)
  })
})
