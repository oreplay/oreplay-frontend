import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import createHorizontalScrollGroup, {
  OVERFLOWS_END_ATTRIBUTE,
  OVERFLOWS_START_ATTRIBUTE,
} from "./createHorizontalScrollGroup.ts"

interface ScrollerSize {
  clientWidth: number
  scrollWidth: number
}

const WIDE_COURSE: ScrollerSize = { clientWidth: 300, scrollWidth: 1000 }
const SHORT_COURSE: ScrollerSize = { clientWidth: 300, scrollWidth: 400 }
const SHORT_COURSE_MAX_SCROLL_LEFT = SHORT_COURSE.scrollWidth - SHORT_COURSE.clientWidth

let notifyResize: (entries: { target: HTMLElement }[]) => void
const unobserve = vi.fn()

function resizeScroller(scroller: HTMLElement, size: ScrollerSize) {
  Object.defineProperty(scroller, "clientWidth", { configurable: true, value: size.clientWidth })
  Object.defineProperty(scroller, "scrollWidth", { configurable: true, value: size.scrollWidth })
}

function clampScrollLeftLikeTheBrowser(scroller: HTMLElement) {
  let scrollLeft = 0
  Object.defineProperty(scroller, "scrollLeft", {
    configurable: true,
    get: () => scrollLeft,
    set: (requested: number) => {
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth
      scrollLeft = Math.min(Math.max(requested, 0), maxScrollLeft)
    },
  })
}

function createScroller(size: ScrollerSize = WIDE_COURSE) {
  const scroller = document.createElement("div")
  resizeScroller(scroller, size)
  clampScrollLeftLikeTheBrowser(scroller)
  return scroller
}

function notifyScroll(scroller: HTMLElement) {
  scroller.dispatchEvent(new Event("scroll"))
}

function scrollTo(scroller: HTMLElement, scrollLeft: number) {
  scroller.scrollLeft = scrollLeft
  notifyScroll(scroller)
}

function createGroupOf(memberCount: number) {
  const group = createHorizontalScrollGroup()
  const members = Array.from({ length: memberCount }, () => createScroller())
  const leaves = members.map((member) => group.join(member))
  return { group, leaves, members }
}

describe("createHorizontalScrollGroup", () => {
  beforeEach(() => {
    unobserve.mockClear()
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: (entries: { target: HTMLElement }[]) => void) {
          notifyResize = callback
        }
        observe = vi.fn()
        unobserve = unobserve
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("moves every other member when one of them scrolls", () => {
    const { members } = createGroupOf(3)
    const [first, second, third] = members

    scrollTo(second, 120)

    expect(first.scrollLeft).toBe(120)
    expect(third.scrollLeft).toBe(120)
  })

  it("does not pull the leader back when the echo of a follower arrives late", () => {
    const { members } = createGroupOf(3)
    const [first, second, third] = members
    scrollTo(first, 50)

    first.scrollLeft = 90
    notifyScroll(second)
    notifyScroll(third)

    expect(first.scrollLeft).toBe(90)
  })

  it("keeps following after the echoes have been ignored", () => {
    const { members } = createGroupOf(3)
    const [first, second, third] = members
    scrollTo(first, 50)
    notifyScroll(second)
    notifyScroll(third)

    scrollTo(third, 200)

    expect(first.scrollLeft).toBe(200)
    expect(second.scrollLeft).toBe(200)
  })

  it("places a late joiner at the current position", () => {
    const { group, members } = createGroupOf(2)
    scrollTo(members[0], 150)
    const lateJoiner = createScroller()

    group.join(lateJoiner)

    expect(lateJoiner.scrollLeft).toBe(150)
  })

  it("does not let the echo of a late joiner lead the group", () => {
    const { group, members } = createGroupOf(2)
    scrollTo(members[0], 150)
    const lateJoiner = createScroller(SHORT_COURSE)

    group.join(lateJoiner)
    notifyScroll(lateJoiner)

    expect(lateJoiner.scrollLeft).toBe(SHORT_COURSE_MAX_SCROLL_LEFT)
    expect(members[0].scrollLeft).toBe(150)
  })

  it("remembers the position while it has no members", () => {
    const { group, leaves, members } = createGroupOf(2)
    scrollTo(members[0], 150)
    leaves.forEach((leave) => leave())
    const lateJoiner = createScroller()

    group.join(lateJoiner)

    expect(lateJoiner.scrollLeft).toBe(150)
  })

  it("no longer writes to a member that left", () => {
    const { leaves, members } = createGroupOf(3)
    const [first, second, third] = members
    leaves[2]()

    scrollTo(first, 80)

    expect(second.scrollLeft).toBe(80)
    expect(third.scrollLeft).toBe(0)
  })

  it("no longer follows a member that left", () => {
    const { leaves, members } = createGroupOf(2)
    leaves[1]()

    scrollTo(members[1], 80)

    expect(members[0].scrollLeft).toBe(0)
    expect(unobserve).toHaveBeenCalledWith(members[1])
  })

  it("lets every member stop at its own maximum scroll", () => {
    const group = createHorizontalScrollGroup()
    const wide = createScroller(WIDE_COURSE)
    const short = createScroller(SHORT_COURSE)
    group.join(wide)
    group.join(short)

    scrollTo(wide, 500)
    notifyScroll(short)

    expect(short.scrollLeft).toBe(SHORT_COURSE_MAX_SCROLL_LEFT)
    expect(wide.scrollLeft).toBe(500)
  })

  it("marks the overflowing edges of a member when it joins", () => {
    const group = createHorizontalScrollGroup()
    const scroller = createScroller()

    group.join(scroller)

    expect(scroller).toHaveAttribute(OVERFLOWS_START_ATTRIBUTE, "false")
    expect(scroller).toHaveAttribute(OVERFLOWS_END_ATTRIBUTE, "true")
  })

  it("updates the overflowing edges of the leader and its followers on scroll", () => {
    const { members } = createGroupOf(2)

    scrollTo(members[0], WIDE_COURSE.scrollWidth - WIDE_COURSE.clientWidth)

    members.forEach((member) => {
      expect(member).toHaveAttribute(OVERFLOWS_START_ATTRIBUTE, "true")
      expect(member).toHaveAttribute(OVERFLOWS_END_ATTRIBUTE, "false")
    })
  })

  it("updates the overflowing edges of a member when it is resized", () => {
    const group = createHorizontalScrollGroup()
    const scroller = createScroller()
    group.join(scroller)

    resizeScroller(scroller, { clientWidth: 1000, scrollWidth: 1000 })
    notifyResize([{ target: scroller }])

    expect(scroller).toHaveAttribute(OVERFLOWS_END_ATTRIBUTE, "false")
  })

  it("does not rewrite an overflow attribute whose value has not changed", () => {
    const { members } = createGroupOf(2)
    const setAttribute = vi.spyOn(members[1], "setAttribute")

    scrollTo(members[0], 10)
    scrollTo(members[0], 20)

    expect(setAttribute).toHaveBeenCalledTimes(1)
    expect(setAttribute).toHaveBeenCalledWith(OVERFLOWS_START_ATTRIBUTE, "true")
  })
})
