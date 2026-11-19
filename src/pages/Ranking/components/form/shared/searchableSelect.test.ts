import { describe, expect, it } from "vitest"
import {
  DROPDOWN_MAX_HEIGHT,
  estimatedListHeight,
  shouldDropUp,
  visibleOptions,
} from "./searchableSelect.ts"

const OPTIONS = [
  { value: "1", label: "Men 21" },
  { value: "2", label: "Women 21" },
  { value: "3", label: "Men 35" },
]

describe("estimatedListHeight", () => {
  it("grows with the options and stops at the maximum height", () => {
    expect(estimatedListHeight(2)).toBe(88)
    expect(estimatedListHeight(50)).toBe(DROPDOWN_MAX_HEIGHT)
  })
})

describe("shouldDropUp", () => {
  it("opens downward when the list fits below", () => {
    expect(shouldDropUp({ top: 100, bottom: 140 }, 800, 3)).toBe(false)
  })

  it("opens upward near the bottom when there is more room above", () => {
    expect(shouldDropUp({ top: 700, bottom: 740 }, 800, 3)).toBe(true)
  })

  it("stays downward when there is even less room above", () => {
    expect(shouldDropUp({ top: 20, bottom: 60 }, 100, 3)).toBe(false)
  })
})

describe("visibleOptions", () => {
  it("filters by label ignoring case", () => {
    expect(visibleOptions(OPTIONS, "men 2", false)).toEqual([OPTIONS[0], OPTIONS[1]])
  })

  it("keeps every option for an empty query", () => {
    expect(visibleOptions(OPTIONS, "", false)).toEqual(OPTIONS)
  })

  it("leaves server-searched options untouched", () => {
    expect(visibleOptions(OPTIONS, "zzz", true)).toEqual(OPTIONS)
  })
})
