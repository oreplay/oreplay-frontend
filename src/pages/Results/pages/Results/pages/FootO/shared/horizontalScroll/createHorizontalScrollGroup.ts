import scrollOverflowEdges from "./scrollOverflowEdges.ts"

export const OVERFLOWS_END_ATTRIBUTE = "data-overflows-end"
export const OVERFLOWS_START_ATTRIBUTE = "data-overflows-start"

const PASSIVE_LISTENER = { passive: true }

export interface HorizontalScrollGroup {
  join: (scroller: HTMLElement) => () => void
}

function writeAttributeIfChanged(scroller: HTMLElement, attribute: string, value: boolean) {
  const attributeValue = String(value)
  if (scroller.getAttribute(attribute) !== attributeValue) {
    scroller.setAttribute(attribute, attributeValue)
  }
}

function writeOverflowEdges(scroller: HTMLElement) {
  const edges = scrollOverflowEdges(scroller.scrollLeft, scroller.scrollWidth, scroller.clientWidth)
  writeAttributeIfChanged(scroller, OVERFLOWS_START_ATTRIBUTE, edges.start)
  writeAttributeIfChanged(scroller, OVERFLOWS_END_ATTRIBUTE, edges.end)
}

function observeResizeIfSupported(onResize: (resized: HTMLElement) => void) {
  if (typeof ResizeObserver === "undefined") return null
  return new ResizeObserver((entries) =>
    entries.forEach((entry) => onResize(entry.target as HTMLElement)),
  )
}

export default function createHorizontalScrollGroup(): HorizontalScrollGroup {
  const members = new Set<HTMLElement>()
  const scrollLeftWrittenByFollowing = new Map<HTMLElement, number>()
  const resizeObserver = observeResizeIfSupported(writeOverflowEdges)
  let groupScrollLeft = 0

  const isEchoOfFollowing = (scroller: HTMLElement) => {
    const writtenScrollLeft = scrollLeftWrittenByFollowing.get(scroller)
    scrollLeftWrittenByFollowing.delete(scroller)
    return writtenScrollLeft === scroller.scrollLeft
  }

  const moveToGroupPosition = (follower: HTMLElement) => {
    const previousScrollLeft = follower.scrollLeft
    follower.scrollLeft = groupScrollLeft
    const hasFollowerMoved = follower.scrollLeft !== previousScrollLeft
    if (hasFollowerMoved) scrollLeftWrittenByFollowing.set(follower, follower.scrollLeft)
    writeOverflowEdges(follower)
  }

  const lead = (leader: HTMLElement) => () => {
    if (isEchoOfFollowing(leader)) return
    groupScrollLeft = leader.scrollLeft
    writeOverflowEdges(leader)
    members.forEach((member) => {
      if (member !== leader) moveToGroupPosition(member)
    })
  }

  const join = (scroller: HTMLElement) => {
    const leadGroup = lead(scroller)
    members.add(scroller)
    scroller.addEventListener("scroll", leadGroup, PASSIVE_LISTENER)
    resizeObserver?.observe(scroller)
    moveToGroupPosition(scroller)

    return () => {
      members.delete(scroller)
      scrollLeftWrittenByFollowing.delete(scroller)
      scroller.removeEventListener("scroll", leadGroup)
      resizeObserver?.unobserve(scroller)
    }
  }

  return { join }
}
