import { describe, expect, it } from "vitest"
import scrollOverflowEdges from "./scrollOverflowEdges.ts"

const CLIENT_WIDTH = 300
const SCROLL_WIDTH = 1000
const MAX_SCROLL_LEFT = SCROLL_WIDTH - CLIENT_WIDTH

describe("scrollOverflowEdges", () => {
  it("overflows only at the end when the scroller is at the start", () => {
    expect(scrollOverflowEdges(0, SCROLL_WIDTH, CLIENT_WIDTH)).toEqual({ end: true, start: false })
  })

  it("overflows at both edges when the scroller is in the middle", () => {
    expect(scrollOverflowEdges(200, SCROLL_WIDTH, CLIENT_WIDTH)).toEqual({ end: true, start: true })
  })

  it("overflows only at the start when the scroller is at the end", () => {
    expect(scrollOverflowEdges(MAX_SCROLL_LEFT, SCROLL_WIDTH, CLIENT_WIDTH)).toEqual({
      end: false,
      start: true,
    })
  })

  it("overflows at no edge when the content fits", () => {
    expect(scrollOverflowEdges(0, CLIENT_WIDTH, CLIENT_WIDTH)).toEqual({ end: false, start: false })
  })

  it("ignores a subpixel remainder at either edge", () => {
    expect(scrollOverflowEdges(0.4, SCROLL_WIDTH, CLIENT_WIDTH).start).toBe(false)
    expect(scrollOverflowEdges(MAX_SCROLL_LEFT - 0.4, SCROLL_WIDTH, CLIENT_WIDTH).end).toBe(false)
  })
})
