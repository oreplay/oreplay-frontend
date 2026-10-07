import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import {
  DEFAULT_ONLINE_COURSE_VISIBILITY,
  onlineCourseVisibilityStorageKey,
  serializeOnlineCourseVisibility,
} from "./onlineCourseVisibility.ts"
import useOnlineCourseVisibility from "./useOnlineCourseVisibility.ts"

const EVENT_ID = "event-a"
const OTHER_EVENT_ID = "event-b"

describe("useOnlineCourseVisibility", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("starts with the default choice when the event has none stored", () => {
    const { result } = renderHook(() => useOnlineCourseVisibility(EVENT_ID))

    expect(result.current.isOnlineCourseVisible).toBe(DEFAULT_ONLINE_COURSE_VISIBILITY)
  })

  it("starts with the choice stored for the event", () => {
    localStorage.setItem(
      onlineCourseVisibilityStorageKey(EVENT_ID),
      serializeOnlineCourseVisibility(false),
    )

    const { result } = renderHook(() => useOnlineCourseVisibility(EVENT_ID))

    expect(result.current.isOnlineCourseVisible).toBe(false)
  })

  it("switches the choice and stores it for the event", () => {
    const { result } = renderHook(() => useOnlineCourseVisibility(EVENT_ID))

    act(() => result.current.toggleOnlineCourseVisibility())

    expect(result.current.isOnlineCourseVisible).toBe(!DEFAULT_ONLINE_COURSE_VISIBILITY)
    expect(localStorage.getItem(onlineCourseVisibilityStorageKey(EVENT_ID))).toBe(
      serializeOnlineCourseVisibility(!DEFAULT_ONLINE_COURSE_VISIBILITY),
    )
  })

  it("keeps the choice of one event apart from the others", () => {
    const { result, rerender } = renderHook(({ eventId }) => useOnlineCourseVisibility(eventId), {
      initialProps: { eventId: EVENT_ID },
    })
    act(() => result.current.toggleOnlineCourseVisibility())

    rerender({ eventId: OTHER_EVENT_ID })

    expect(result.current.isOnlineCourseVisible).toBe(DEFAULT_ONLINE_COURSE_VISIBILITY)
    expect(localStorage.getItem(onlineCourseVisibilityStorageKey(OTHER_EVENT_ID))).toBeNull()
  })
})
