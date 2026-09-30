import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { recentIdsStorageKey } from "./recentSelections.ts"
import { useRecentClassesClubs } from "./useRecentClassesClubs.ts"

const EVENT_ID = "event-1"

describe("useRecentClassesClubs", () => {
  afterEach(() => localStorage.clear())

  it("starts from what is stored for the event", () => {
    localStorage.setItem(
      recentIdsStorageKey(EVENT_ID),
      JSON.stringify({ classes: ["a"], clubs: ["x"] }),
    )
    const { result } = renderHook(() => useRecentClassesClubs(EVENT_ID))
    expect(result.current.recentIds).toEqual({ classes: ["a"], clubs: ["x"] })
  })

  it("persists remembered ids to localStorage", () => {
    const { result } = renderHook(() => useRecentClassesClubs(EVENT_ID))
    act(() => result.current.rememberRecent("classes", "a"))
    act(() => result.current.rememberRecent("clubs", "x"))

    const stored = localStorage.getItem(recentIdsStorageKey(EVENT_ID))
    expect(stored).toBe(JSON.stringify({ classes: ["a"], clubs: ["x"] }))
  })

  it("keeps each event's recents separate", () => {
    const { result } = renderHook(() => useRecentClassesClubs(EVENT_ID))
    act(() => result.current.rememberRecent("classes", "a"))

    const other = renderHook(() => useRecentClassesClubs("event-2"))
    expect(other.result.current.recentIds.classes).toEqual([])
  })
})
