import scrollOverflowEdges from "./scrollOverflowEdges.ts"

export const OVERFLOWS_END_ATTRIBUTE = "data-overflows-end"
export const OVERFLOWS_START_ATTRIBUTE = "data-overflows-start"

const PASSIVE_LISTENER = { passive: true }
const REINSERTED_NODES_OBSERVATION = { childList: true, subtree: true }

export interface HorizontalScrollGroup {
  join: (scroller: HTMLElement) => () => void
  watchReorders: (container: HTMLElement) => () => void
}

/**
 * Sets a boolean attribute only when its value changes, so the DOM is not touched needlessly.
 *
 * @param scroller Element the attribute belongs to.
 * @param attribute Name of the attribute.
 * @param value Value to write.
 */
function writeAttributeIfChanged(scroller: HTMLElement, attribute: string, value: boolean) {
  const attributeValue = String(value)
  if (scroller.getAttribute(attribute) !== attributeValue) {
    scroller.setAttribute(attribute, attributeValue)
  }
}

/**
 * Marks on a scroller which of its edges have content hidden beyond them.
 *
 * @param scroller Scroller to mark.
 */
function writeOverflowEdges(scroller: HTMLElement) {
  const edges = scrollOverflowEdges(scroller.scrollLeft, scroller.scrollWidth, scroller.clientWidth)
  writeAttributeIfChanged(scroller, OVERFLOWS_START_ATTRIBUTE, edges.start)
  writeAttributeIfChanged(scroller, OVERFLOWS_END_ATTRIBUTE, edges.end)
}

/**
 * Creates an observer that reports every element that changes size.
 *
 * @param onResize Called with each resized element.
 * @returns The observer, or `null` where the browser has no `ResizeObserver`.
 */
function observeResizeIfSupported(onResize: (resized: HTMLElement) => void) {
  if (typeof ResizeObserver === "undefined") return null
  return new ResizeObserver((entries) =>
    entries.forEach((entry) => onResize(entry.target as HTMLElement)),
  )
}

/**
 * Tells whether any node has been inserted, which is what moving a node to another place does.
 *
 * @param mutations Changes reported for a container.
 * @returns `true` when at least one change inserted nodes.
 */
function hasInsertedNodes(mutations: MutationRecord[]) {
  return mutations.some((mutation) => mutation.addedNodes.length > 0)
}

/**
 * Creates a group of horizontal scrollers that move together: scrolling one of them moves the
 * rest to the same position.
 *
 * @returns The group, with `join` to add a scroller and `watchReorders` to keep the position of
 * the scrollers that are moved to another place in a container. Both return how to undo it.
 */
export default function createHorizontalScrollGroup(): HorizontalScrollGroup {
  const members = new Set<HTMLElement>()
  const scrollLeftWrittenByFollowing = new Map<HTMLElement, number>()
  const resizeObserver = observeResizeIfSupported(writeOverflowEdges)
  let groupScrollLeft = 0

  /**
   * Tells whether a scroll event comes from the group moving the scroller, not from the user.
   *
   * @param scroller Scroller the event was fired on.
   * @returns `true` when the scroller is where the group last put it.
   */
  const isEchoOfFollowing = (scroller: HTMLElement) => {
    const writtenScrollLeft = scrollLeftWrittenByFollowing.get(scroller)
    scrollLeftWrittenByFollowing.delete(scroller)
    return writtenScrollLeft === scroller.scrollLeft
  }

  /**
   * Scrolls a member to the position of the group, as far as its own content allows.
   *
   * @param follower Member to move.
   */
  const moveToGroupPosition = (follower: HTMLElement) => {
    const previousScrollLeft = follower.scrollLeft
    follower.scrollLeft = groupScrollLeft
    const hasFollowerMoved = follower.scrollLeft !== previousScrollLeft
    if (hasFollowerMoved) scrollLeftWrittenByFollowing.set(follower, follower.scrollLeft)
    writeOverflowEdges(follower)
  }

  /**
   * Builds the scroll listener of a member, which makes the rest of the group follow it.
   *
   * @param leader Member the listener belongs to.
   * @returns The listener.
   */
  const lead = (leader: HTMLElement) => () => {
    if (isEchoOfFollowing(leader)) return
    groupScrollLeft = leader.scrollLeft
    writeOverflowEdges(leader)
    members.forEach((member) => {
      if (member !== leader) moveToGroupPosition(member)
    })
  }

  /**
   * Adds a scroller to the group and places it at the position of the group.
   *
   * @param scroller Scroller to add.
   * @returns How to take the scroller out of the group.
   */
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

  /**
   * Keeps the members at the position of the group when a list is reordered. A browser resets
   * the scroll of an element that is inserted again, which is how a list moves its items.
   *
   * @param container Element that holds the members that can be reordered.
   * @returns How to stop watching the container.
   */
  const watchReorders = (container: HTMLElement) => {
    const reinsertionObserver = new MutationObserver((mutations) => {
      if (hasInsertedNodes(mutations)) members.forEach(moveToGroupPosition)
    })
    reinsertionObserver.observe(container, REINSERTED_NODES_OBSERVATION)

    return () => reinsertionObserver.disconnect()
  }

  return { join, watchReorders }
}
