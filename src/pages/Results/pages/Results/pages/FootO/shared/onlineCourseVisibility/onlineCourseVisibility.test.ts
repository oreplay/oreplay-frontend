import { describe, expect, it } from "vitest"
import {
  DEFAULT_ONLINE_COURSE_VISIBILITY,
  onlineCourseVisibilityStorageKey,
  parseOnlineCourseVisibility,
  serializeOnlineCourseVisibility,
} from "./onlineCourseVisibility.ts"

describe("onlineCourseVisibilityStorageKey", () => {
  it("is different for every event", () => {
    expect(onlineCourseVisibilityStorageKey("event-a")).not.toBe(
      onlineCourseVisibilityStorageKey("event-b"),
    )
  })
})

describe("parseOnlineCourseVisibility", () => {
  it("reads back a stored choice", () => {
    expect(parseOnlineCourseVisibility(serializeOnlineCourseVisibility(true))).toBe(true)
    expect(parseOnlineCourseVisibility(serializeOnlineCourseVisibility(false))).toBe(false)
  })

  it("falls back to the default when nothing has been stored", () => {
    expect(parseOnlineCourseVisibility(null)).toBe(DEFAULT_ONLINE_COURSE_VISIBILITY)
  })

  it("falls back to the default when the stored value is not a choice", () => {
    expect(parseOnlineCourseVisibility("maybe")).toBe(DEFAULT_ONLINE_COURSE_VISIBILITY)
  })
})
