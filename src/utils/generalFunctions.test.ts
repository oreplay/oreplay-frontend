import { describe, it, vi, expect } from "vitest"
import { maxBy } from "./generalFunctions.ts"

describe("maxBy", () => {
  it("returns the element with the maximum key", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 30 },
      { name: "C", value: 20 },
    ]

    const result = maxBy(data, (x) => x.value)

    expect(result).toBe(data.at(1))
  })

  it("works with negative numbers", () => {
    const data = [-10, -5, -20]

    const result = maxBy(data, (x) => x)

    expect(result).toBe(-5)
  })

  it("returns the first item when multiple have the same max key", () => {
    const data = [
      { name: "A", value: 50 },
      { name: "B", value: 50 },
    ]

    const result = maxBy(data, (x) => x.value)

    expect(result).toEqual(data[0])
  })

  it("calls key exactly once per item", () => {
    const data = [1, 2, 3]
    const key = vi.fn((x: number) => x)

    maxBy(data, key)

    expect(key).toHaveBeenCalledTimes(data.length)
  })

  it("works with a single element array", () => {
    const data = [{ value: 42 }]

    const result = maxBy(data, (x) => x.value)

    expect(result).toEqual(data[0])
  })

  it("throws on empty array", () => {
    expect(() => maxBy([], (x) => x as number)).toThrow()
  })
})
