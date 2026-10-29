import { describe, expect, it } from "vitest"
import { findOutdatedQuery, isShowingOutdatedData, QueryHealth } from "./outdatedData.ts"

const CURRENT: QueryHealth = { error: null, hasData: true, isActive: true, isError: false }
const OUTDATED: QueryHealth = {
  error: new Error("runners"),
  hasData: true,
  isActive: true,
  isError: true,
}

describe("findOutdatedQuery", () => {
  it("finds a query on screen whose refresh failed while it still has data", () => {
    expect(findOutdatedQuery([CURRENT, OUTDATED])).toBe(OUTDATED)
  })

  it("ignores queries that are not on screen", () => {
    expect(findOutdatedQuery([CURRENT, { ...OUTDATED, isActive: false }])).toBeUndefined()
  })

  it("ignores failures with nothing loaded yet", () => {
    expect(findOutdatedQuery([{ ...OUTDATED, hasData: false }])).toBeUndefined()
  })

  it("finds nothing when every query is current or there are none", () => {
    expect(findOutdatedQuery([CURRENT])).toBeUndefined()
    expect(findOutdatedQuery([])).toBeUndefined()
  })
})

describe("isShowingOutdatedData", () => {
  it("is outdated when a refresh failed but earlier data is still shown", () => {
    expect(isShowingOutdatedData(true, true)).toBe(true)
  })

  it("is not outdated when the request failed with nothing loaded", () => {
    expect(isShowingOutdatedData(true, false)).toBe(false)
  })

  it("is not outdated when the latest request succeeded", () => {
    expect(isShowingOutdatedData(false, true)).toBe(false)
    expect(isShowingOutdatedData(false, false)).toBe(false)
  })
})
