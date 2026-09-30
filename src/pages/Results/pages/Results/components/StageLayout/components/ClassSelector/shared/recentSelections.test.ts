import { describe, expect, it } from "vitest"
import {
  EMPTY_RECENT_IDS,
  RECENT_LIMITS,
  RecentIds,
  parseRecentIds,
  recentIdsStorageKey,
  recentItems,
  withRecentId,
} from "./recentSelections.ts"

describe("parseRecentIds", () => {
  it("returns empty recents when nothing is stored", () => {
    expect(parseRecentIds(null)).toEqual(EMPTY_RECENT_IDS)
  })

  it("returns empty recents for malformed JSON", () => {
    expect(parseRecentIds("{not json")).toEqual(EMPTY_RECENT_IDS)
  })

  it("returns empty recents for a non-object value", () => {
    expect(parseRecentIds("42")).toEqual(EMPTY_RECENT_IDS)
  })

  it("keeps valid lists and drops invalid ones", () => {
    const raw = JSON.stringify({ classes: ["a", "b"], clubs: [1, 2] })
    expect(parseRecentIds(raw)).toEqual({ classes: ["a", "b"], clubs: [] })
  })

  it("trims stored lists to the tab limit", () => {
    const raw = JSON.stringify({ classes: ["1", "2", "3", "4", "5", "6", "7"], clubs: [] })
    expect(parseRecentIds(raw).classes).toHaveLength(RECENT_LIMITS.classes)
  })
})

describe("recentIdsStorageKey", () => {
  it("scopes the key to the event", () => {
    expect(recentIdsStorageKey("event-1")).toBe("recentClassesClubs:event-1")
  })
})

describe("recentItems", () => {
  const items = [
    { id: "a", name: "M21" },
    { id: "b", name: "F21" },
    { id: "c", name: "M16" },
  ]
  const byId = (item: { id: string }) => item.id

  it("returns the items in recent order", () => {
    expect(recentItems(items, ["c", "a"], byId).map(byId)).toEqual(["c", "a"])
  })

  it("skips ids that are no longer in the list", () => {
    expect(recentItems(items, ["gone", "b"], byId).map(byId)).toEqual(["b"])
  })
})

describe("withRecentId", () => {
  it("puts the new id first", () => {
    const recent: RecentIds = { classes: ["a", "b"], clubs: ["x"] }
    expect(withRecentId(recent, "classes", "c")).toEqual({ classes: ["c", "a", "b"], clubs: ["x"] })
  })

  it("moves an existing id to the front without duplicating it", () => {
    const recent: RecentIds = { classes: ["a", "b", "c"], clubs: [] }
    expect(withRecentId(recent, "classes", "c").classes).toEqual(["c", "a", "b"])
  })

  it("keeps at most the tab limit", () => {
    const recent: RecentIds = { classes: [], clubs: ["x", "y", "z"] }
    expect(withRecentId(recent, "clubs", "w").clubs).toEqual(["w", "x", "y"])
  })
})
