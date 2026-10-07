import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import trackScrollbarMetrics, {
  SCROLL_PROGRESS_CSS_VARIABLE,
  VISIBLE_RATIO_CSS_VARIABLE,
} from "./trackScrollbarMetrics.ts"

interface ScrollerSize {
  clientWidth: number
  scrollWidth: number
}

let notifyResize: () => void
const observe = vi.fn()
const disconnect = vi.fn()

function resizeScroller(scroller: HTMLElement, size: ScrollerSize) {
  Object.defineProperty(scroller, "clientWidth", { configurable: true, value: size.clientWidth })
  Object.defineProperty(scroller, "scrollWidth", { configurable: true, value: size.scrollWidth })
}

function createScroller(size: ScrollerSize) {
  const scroller = document.createElement("div")
  const content = document.createElement("table")
  scroller.appendChild(content)
  resizeScroller(scroller, size)
  return { content, scroller }
}

function scrollTo(scroller: HTMLElement, scrollLeft: number) {
  scroller.scrollLeft = scrollLeft
  scroller.dispatchEvent(new Event("scroll"))
}

describe("trackScrollbarMetrics", () => {
  beforeEach(() => {
    observe.mockClear()
    disconnect.mockClear()
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          notifyResize = callback
        }
        observe = observe
        disconnect = disconnect
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("writes the metrics of the scroller as soon as it starts tracking", () => {
    const { scroller } = createScroller({ clientWidth: 400, scrollWidth: 1000 })
    const scrollbar = document.createElement("div")

    trackScrollbarMetrics(scroller, scrollbar)

    expect(scrollbar.style.getPropertyValue(SCROLL_PROGRESS_CSS_VARIABLE)).toBe("0")
    expect(scrollbar.style.getPropertyValue(VISIBLE_RATIO_CSS_VARIABLE)).toBe("0.4")
  })

  it("updates the scroll progress when the scroller scrolls", () => {
    const { scroller } = createScroller({ clientWidth: 400, scrollWidth: 1000 })
    const scrollbar = document.createElement("div")
    trackScrollbarMetrics(scroller, scrollbar)

    scrollTo(scroller, 300)

    expect(scrollbar.style.getPropertyValue(SCROLL_PROGRESS_CSS_VARIABLE)).toBe("0.5")
  })

  it("observes the scroller and its content so a resize of either is noticed", () => {
    const { content, scroller } = createScroller({ clientWidth: 400, scrollWidth: 1000 })

    trackScrollbarMetrics(scroller, document.createElement("div"))

    expect(observe).toHaveBeenCalledWith(scroller)
    expect(observe).toHaveBeenCalledWith(content)
  })

  it("updates the visible ratio when the scroller or its content is resized", () => {
    const { scroller } = createScroller({ clientWidth: 400, scrollWidth: 1000 })
    const scrollbar = document.createElement("div")
    trackScrollbarMetrics(scroller, scrollbar)

    resizeScroller(scroller, { clientWidth: 400, scrollWidth: 1600 })
    notifyResize()

    expect(scrollbar.style.getPropertyValue(VISIBLE_RATIO_CSS_VARIABLE)).toBe("0.25")
  })

  it("stops updating the scrollbar once tracking is stopped", () => {
    const { scroller } = createScroller({ clientWidth: 400, scrollWidth: 1000 })
    const scrollbar = document.createElement("div")
    const stopTracking = trackScrollbarMetrics(scroller, scrollbar)

    stopTracking()
    scrollTo(scroller, 300)

    expect(disconnect).toHaveBeenCalledOnce()
    expect(scrollbar.style.getPropertyValue(SCROLL_PROGRESS_CSS_VARIABLE)).toBe("0")
  })
})
