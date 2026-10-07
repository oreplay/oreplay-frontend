import { describe, expect, it } from "vitest"
import {
  availableSplitsViews,
  defaultSplitsView,
  SPLITS_VIEW,
  SPLITS_VIEW_CONFIG,
} from "./splitsViews.ts"

describe("availableSplitsViews", () => {
  it("offers the radios view first when the class has radios", () => {
    expect(availableSplitsViews(true)).toEqual([
      SPLITS_VIEW.Radios,
      SPLITS_VIEW.Splits,
      SPLITS_VIEW.Accumulated,
      SPLITS_VIEW.TimeLoss,
    ])
  })

  it("hides the radios view when the class has no radios", () => {
    expect(availableSplitsViews(false)).toEqual([
      SPLITS_VIEW.Splits,
      SPLITS_VIEW.Accumulated,
      SPLITS_VIEW.TimeLoss,
    ])
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

  it("only analyses time loss on the time loss view", () => {
    expect(SPLITS_VIEW_CONFIG[SPLITS_VIEW.TimeLoss].timeLossEnabled).toBe(true)
    expect(SPLITS_VIEW_CONFIG[SPLITS_VIEW.Splits].timeLossEnabled).toBe(false)
  })
})
