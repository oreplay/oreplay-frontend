import { renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getControlLiveUrl } from "./controlLiveUrl.ts"
import { RESUBSCRIBE_MILLISECONDS, useControlChanges } from "./useControlChanges.ts"

const STAGE_ID = "stage-1"
const STATION = 31

/** Stand-in for the browser's `EventSource`, which jsdom lacks; it records every stream opened. */
class FakeEventSource {
  static opened: FakeEventSource[] = []
  onmessage: (() => void) | null = null
  close = vi.fn()

  /**
   * Records the new stream.
   * @param url Address the stream was opened on.
   */
  constructor(readonly url: string) {
    FakeEventSource.opened.push(this)
  }
}

/**
 * Last stream the hook opened.
 * @returns The most recent fake stream.
 */
function lastStream() {
  return FakeEventSource.opened[FakeEventSource.opened.length - 1]
}

describe("useControlChanges", () => {
  beforeEach(() => {
    FakeEventSource.opened = []
    vi.stubGlobal("EventSource", FakeEventSource)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("calls onChange for each message on the control's channel", () => {
    const onChange = vi.fn()
    renderHook(() => useControlChanges(STAGE_ID, STATION, onChange))

    lastStream().onmessage?.()
    lastStream().onmessage?.()

    expect(lastStream().url).toBe(getControlLiveUrl(STAGE_ID, STATION))
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it("reopens the stream before the server forgets the control is watched", () => {
    const onChange = vi.fn()
    renderHook(() => useControlChanges(STAGE_ID, STATION, onChange))
    const firstStream = lastStream()

    vi.advanceTimersByTime(RESUBSCRIBE_MILLISECONDS)
    lastStream().onmessage?.()

    expect(firstStream.close).toHaveBeenCalled()
    expect(FakeEventSource.opened).toHaveLength(2)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("closes the stream on unmount", () => {
    const { unmount } = renderHook(() => useControlChanges(STAGE_ID, STATION, vi.fn()))

    unmount()
    vi.advanceTimersByTime(RESUBSCRIBE_MILLISECONDS)

    expect(lastStream().close).toHaveBeenCalled()
    expect(FakeEventSource.opened).toHaveLength(1)
  })
})
