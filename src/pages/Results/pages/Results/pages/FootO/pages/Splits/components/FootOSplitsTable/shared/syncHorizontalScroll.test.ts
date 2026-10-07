import { describe, expect, it } from "vitest"
import syncHorizontalScroll from "./syncHorizontalScroll.ts"

function createScrollers() {
  return { body: document.createElement("div"), header: document.createElement("div") }
}

function notifyScroll(scroller: HTMLElement) {
  scroller.dispatchEvent(new Event("scroll"))
}

function scrollTo(scroller: HTMLElement, scrollLeft: number) {
  scroller.scrollLeft = scrollLeft
  notifyScroll(scroller)
}

describe("syncHorizontalScroll", () => {
  it("moves the second scroller when the first one scrolls", () => {
    const { body, header } = createScrollers()
    syncHorizontalScroll(header, body)

    scrollTo(header, 120)

    expect(body.scrollLeft).toBe(120)
  })

  it("moves the first scroller when the second one scrolls", () => {
    const { body, header } = createScrollers()
    syncHorizontalScroll(header, body)

    scrollTo(body, 80)

    expect(header.scrollLeft).toBe(80)
  })

  it("does not pull the leader back when the echo of the follower arrives late", () => {
    const { body, header } = createScrollers()
    syncHorizontalScroll(header, body)
    scrollTo(body, 50)

    body.scrollLeft = 90
    notifyScroll(header)

    expect(body.scrollLeft).toBe(90)
  })

  it("keeps following after an echo has been ignored", () => {
    const { body, header } = createScrollers()
    syncHorizontalScroll(header, body)
    scrollTo(body, 50)
    notifyScroll(header)

    scrollTo(header, 200)

    expect(body.scrollLeft).toBe(200)
  })

  it("follows a scroll that returns to a position the follower was already at", () => {
    const { body, header } = createScrollers()
    syncHorizontalScroll(header, body)
    scrollTo(body, 50)
    notifyScroll(header)
    scrollTo(header, 200)
    notifyScroll(body)

    scrollTo(header, 50)

    expect(body.scrollLeft).toBe(50)
  })

  it("stops following once the sync is stopped", () => {
    const { body, header } = createScrollers()
    const stopSync = syncHorizontalScroll(header, body)

    stopSync()
    scrollTo(body, 80)

    expect(header.scrollLeft).toBe(0)
  })
})
