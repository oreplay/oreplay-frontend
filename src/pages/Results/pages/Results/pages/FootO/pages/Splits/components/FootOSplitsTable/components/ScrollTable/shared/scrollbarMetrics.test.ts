import { describe, expect, it } from "vitest"
import {
  scrollLeftAfterThumbDrag,
  scrollLeftForTrackClick,
  scrollProgress,
  visibleRatio,
} from "./scrollbarMetrics.ts"

describe("scrollLeftAfterThumbDrag", () => {
  const drag = { maxScrollLeft: 600, pointerDelta: 0, startScrollLeft: 100, thumbTravel: 300 }

  it("scrolls the content proportionally to the thumb travel", () => {
    expect(scrollLeftAfterThumbDrag({ ...drag, pointerDelta: 50 })).toBe(200)
  })

  it("scrolls back when the thumb is dragged to the left", () => {
    expect(scrollLeftAfterThumbDrag({ ...drag, pointerDelta: -25 })).toBe(50)
  })

  it("never scrolls past the end of the content", () => {
    expect(scrollLeftAfterThumbDrag({ ...drag, pointerDelta: 1000 })).toBe(600)
  })

  it("never scrolls before the start of the content", () => {
    expect(scrollLeftAfterThumbDrag({ ...drag, pointerDelta: -1000 })).toBe(0)
  })

  it("keeps the scroll position when the thumb fills the track", () => {
    expect(scrollLeftAfterThumbDrag({ ...drag, pointerDelta: 50, thumbTravel: 0 })).toBe(100)
  })

  it("keeps the scroll position when the content does not overflow", () => {
    expect(scrollLeftAfterThumbDrag({ ...drag, maxScrollLeft: 0, pointerDelta: 50 })).toBe(100)
  })
})

describe("scrollLeftForTrackClick", () => {
  const click = { clickOffset: 0, scrollWidth: 1200, thumbWidth: 100, trackWidth: 400 }

  it("centers the thumb on the clicked point", () => {
    expect(scrollLeftForTrackClick({ ...click, clickOffset: 250 })).toBe(600)
  })

  it("rounds the scroll position down to a whole pixel", () => {
    expect(scrollLeftForTrackClick({ ...click, clickOffset: 151 })).toBe(303)
  })

  it("scrolls to the start when the click is closer than half a thumb to the edge", () => {
    expect(scrollLeftForTrackClick({ ...click, clickOffset: 10 })).toBe(0)
  })

  it("scrolls to the start when the track has no width", () => {
    expect(scrollLeftForTrackClick({ ...click, clickOffset: 250, trackWidth: 0 })).toBe(0)
  })
})

describe("scrollProgress", () => {
  it("is 0 at the start of the content", () => {
    expect(scrollProgress(0, 1000, 400)).toBe(0)
  })

  it("is 1 at the end of the content", () => {
    expect(scrollProgress(600, 1000, 400)).toBe(1)
  })

  it("is the scrolled fraction of the scrollable distance", () => {
    expect(scrollProgress(150, 1000, 400)).toBe(0.25)
  })

  it("is 0 when the content does not overflow", () => {
    expect(scrollProgress(0, 400, 400)).toBe(0)
  })

  it("stays within 0 and 1 while the browser overscrolls", () => {
    expect(scrollProgress(-30, 1000, 400)).toBe(0)
    expect(scrollProgress(650, 1000, 400)).toBe(1)
  })
})

describe("visibleRatio", () => {
  it("is the fraction of the content that fits in the viewport", () => {
    expect(visibleRatio(1000, 400)).toBe(0.4)
  })

  it("is 1 when the content does not overflow", () => {
    expect(visibleRatio(400, 400)).toBe(1)
  })

  it("is 1 before the content has been laid out", () => {
    expect(visibleRatio(0, 0)).toBe(1)
  })
})
