import { describe, it, expect } from "vitest"
import { multiLevelCompare } from "./sortRunners.ts"

describe("multilevelCompare", () => {
  it("should handle two compare functions", () => {
    const a = "11"
    const b = "12"
    const c = "21"
    const d = "22"

    const compare1 = (a: string, b: string) => {
      const a0 = a.at(0)
      const b0 = b.at(0)

      if (a0 && b0) {
        return a0.localeCompare(b0)
      } else {
        return 0
      }
    }
    const compare2 = (a: string, b: string) => {
      const a1 = a.at(1)
      const b1 = b.at(1)

      if (a1 && b1) {
        return a1.localeCompare(b1)
      } else {
        return 0
      }
    }

    const actual = [c, b, a, d].sort((a, b) => {
      return multiLevelCompare(a, b, [compare1, compare2])
    })
    const expected = [a, b, c, d]

    expect(actual).toEqual(expected)
  })
})
