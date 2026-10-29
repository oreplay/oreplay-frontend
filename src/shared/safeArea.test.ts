import { describe, expect, it } from "vitest"
import {
  cssPixelsToNumber,
  measureCssLengthPx,
  offsetFromSafeArea,
  overlapSafeArea,
  SAFE_AREA_INSET_BOTTOM,
  SAFE_AREA_INSET_TOP,
} from "./safeArea.ts"

describe("cssPixelsToNumber", () => {
  it("reads a pixel length", () => {
    expect(cssPixelsToNumber("34px")).toBe(34)
  })

  it("keeps fractional pixels", () => {
    expect(cssPixelsToNumber("59.5px")).toBe(59.5)
  })

  it("treats an empty value as no length", () => {
    expect(cssPixelsToNumber("")).toBe(0)
  })

  it("treats an unresolved env() as no length", () => {
    expect(cssPixelsToNumber(SAFE_AREA_INSET_BOTTOM)).toBe(0)
  })
})

describe("measureCssLengthPx", () => {
  it("is 0 where the browser has no hidden areas", () => {
    expect(measureCssLengthPx(SAFE_AREA_INSET_BOTTOM)).toBe(0)
  })

  it("resolves a plain pixel length", () => {
    expect(measureCssLengthPx("12px")).toBe(12)
  })

  it("leaves no probe element behind", () => {
    const childCount = document.body.childElementCount
    measureCssLengthPx(SAFE_AREA_INSET_TOP)
    expect(document.body.childElementCount).toBe(childCount)
  })
})

describe("offsetFromSafeArea", () => {
  it("adds the pixels to the hidden area", () => {
    expect(offsetFromSafeArea(SAFE_AREA_INSET_TOP, 8)).toBe("calc(8px + env(safe-area-inset-top))")
  })

  it("works with no extra distance", () => {
    expect(offsetFromSafeArea(SAFE_AREA_INSET_BOTTOM, 0)).toBe(
      "calc(0px + env(safe-area-inset-bottom))",
    )
  })
})

describe("overlapSafeArea", () => {
  it("shrinks the hidden area without going below zero", () => {
    expect(overlapSafeArea(SAFE_AREA_INSET_BOTTOM, 16)).toBe(
      "max(0px, env(safe-area-inset-bottom) - 16px)",
    )
  })
})
