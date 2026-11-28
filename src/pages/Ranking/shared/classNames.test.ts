import { describe, expect, it } from "vitest"
import { formatClassNames, isKnownClassNamePattern, parseClassNames } from "./classNames.ts"

describe("formatClassNames", () => {
  it("joins the class names for the text field", () => {
    expect(formatClassNames(["ME", "FE"])).toBe("ME, FE")
  })

  it("is empty when the ranking includes every class", () => {
    expect(formatClassNames([])).toBe("")
    expect(formatClassNames(null)).toBe("")
  })
})

describe("parseClassNames", () => {
  it("splits the typed text on commas, ignoring spacing", () => {
    expect(parseClassNames(" ME ,FE,  H-35 ")).toEqual(["ME", "FE", "H-35"])
  })

  it("drops empty entries, so a trailing comma adds no class", () => {
    expect(parseClassNames("ME,,FE,")).toEqual(["ME", "FE"])
  })

  it("is an empty list when nothing is typed", () => {
    expect(parseClassNames("   ")).toEqual([])
  })
})

describe("isKnownClassNamePattern", () => {
  it("accepts a sex letter, an age or elite, and an optional level", () => {
    expect(isKnownClassNamePattern("M-21")).toBe(true)
    expect(isKnownClassNamePattern("F-35")).toBe(true)
    expect(isKnownClassNamePattern("W-E")).toBe(true)
    expect(isKnownClassNamePattern("D-16B")).toBe(true)
  })

  it("rejects a name that does not follow the pattern", () => {
    expect(isKnownClassNamePattern("ME")).toBe(false)
    expect(isKnownClassNamePattern("M21")).toBe(false)
    expect(isKnownClassNamePattern("M-1")).toBe(false)
    expect(isKnownClassNamePattern("M-210")).toBe(false)
    expect(isKnownClassNamePattern("M-21D")).toBe(false)
    expect(isKnownClassNamePattern("m-21")).toBe(false)
    expect(isKnownClassNamePattern("M-21a")).toBe(false)
    expect(isKnownClassNamePattern("Senior")).toBe(false)
  })
})
