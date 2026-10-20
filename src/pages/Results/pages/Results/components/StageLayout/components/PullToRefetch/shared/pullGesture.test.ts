import { describe, expect, it } from "vitest"
import {
  dampPullDistance,
  hasPassedDirectionSlop,
  hasScrolledAncestor,
  indicatorOffset,
  isDownwardPull,
  isPullPastThreshold,
  PULL_DIRECTION_SLOP_PX,
  PULL_INDICATOR_SIZE_PX,
  PULL_MAX_DISTANCE_PX,
  PULL_THRESHOLD_PX,
  pullProgress,
} from "./pullGesture.ts"

/**
 * Pretends an element is scrolled, since jsdom does no layout and always reports 0.
 * @param element - The element to fake.
 * @param scrollTop - The scroll offset it should report, in px.
 */
function setScrollTop(element: Element, scrollTop: number) {
  Object.defineProperty(element, "scrollTop", { configurable: true, value: scrollTop })
}

describe("dampPullDistance", () => {
  it("moves the content at half the finger's travel", () => {
    expect(dampPullDistance(100)).toBe(50)
  })

  it("never goes negative when the finger moves up", () => {
    expect(dampPullDistance(-40)).toBe(0)
  })

  it("stops at the maximum distance", () => {
    expect(dampPullDistance(10_000)).toBe(PULL_MAX_DISTANCE_PX)
  })
})

describe("hasPassedDirectionSlop", () => {
  it("ignores movements within the slop", () => {
    expect(hasPassedDirectionSlop(PULL_DIRECTION_SLOP_PX, -PULL_DIRECTION_SLOP_PX)).toBe(false)
  })

  it.each([
    [PULL_DIRECTION_SLOP_PX + 1, 0],
    [0, -(PULL_DIRECTION_SLOP_PX + 1)],
  ])("detects a movement past the slop on either axis: (%d, %d)", (deltaX, deltaY) => {
    expect(hasPassedDirectionSlop(deltaX, deltaY)).toBe(true)
  })
})

describe("hasScrolledAncestor", () => {
  it("is false when nothing between the target and the boundary is scrolled", () => {
    const boundary = document.createElement("div")
    const target = document.createElement("span")
    boundary.appendChild(target)

    expect(hasScrolledAncestor(target, boundary)).toBe(false)
  })

  it("is true when an ancestor inside the boundary is scrolled down", () => {
    const boundary = document.createElement("div")
    const list = document.createElement("ul")
    const target = document.createElement("li")
    boundary.appendChild(list)
    list.appendChild(target)
    setScrollTop(list, 30)

    expect(hasScrolledAncestor(target, boundary)).toBe(true)
  })

  it("ignores scrolled elements outside the boundary", () => {
    const outside = document.createElement("div")
    const boundary = document.createElement("div")
    const target = document.createElement("span")
    outside.appendChild(boundary)
    boundary.appendChild(target)
    setScrollTop(outside, 30)

    expect(hasScrolledAncestor(target, boundary)).toBe(false)
  })

  it("is false for a missing target", () => {
    expect(hasScrolledAncestor(null, document.createElement("div"))).toBe(false)
  })
})

describe("indicatorOffset", () => {
  it("centres the indicator in the gap above the content", () => {
    expect(indicatorOffset(PULL_INDICATOR_SIZE_PX + 20)).toBe(10)
  })

  it("hides the indicator above the area when nothing is pulled", () => {
    expect(indicatorOffset(0)).toBe(-PULL_INDICATOR_SIZE_PX / 2)
  })
})

describe("isDownwardPull", () => {
  it("accepts a mostly vertical, downward movement", () => {
    expect(isDownwardPull(5, 20)).toBe(true)
  })

  it.each([
    [30, 20],
    [-30, 20],
    [0, -20],
  ])("rejects a sideways or upward movement: (%d, %d)", (deltaX, deltaY) => {
    expect(isDownwardPull(deltaX, deltaY)).toBe(false)
  })
})

describe("isPullPastThreshold", () => {
  it("triggers from the threshold on", () => {
    expect(isPullPastThreshold(PULL_THRESHOLD_PX - 1)).toBe(false)
    expect(isPullPastThreshold(PULL_THRESHOLD_PX)).toBe(true)
  })
})

describe("pullProgress", () => {
  it("grows linearly up to the threshold", () => {
    expect(pullProgress(PULL_THRESHOLD_PX / 2)).toBe(0.5)
  })

  it("stays within 0 and 1", () => {
    expect(pullProgress(-10)).toBe(0)
    expect(pullProgress(PULL_MAX_DISTANCE_PX)).toBe(1)
  })
})
