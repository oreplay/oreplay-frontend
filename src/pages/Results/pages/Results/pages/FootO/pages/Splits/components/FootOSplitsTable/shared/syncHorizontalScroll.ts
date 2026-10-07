const PASSIVE_LISTENER = { passive: true }

export default function syncHorizontalScroll(first: HTMLElement, second: HTMLElement) {
  const scrollLeftWrittenByFollowing = new Map<HTMLElement, number>()

  const isEchoOfFollowing = (scroller: HTMLElement) => {
    const writtenScrollLeft = scrollLeftWrittenByFollowing.get(scroller)
    scrollLeftWrittenByFollowing.delete(scroller)
    return writtenScrollLeft === scroller.scrollLeft
  }

  const follow = (leader: HTMLElement, follower: HTMLElement) => () => {
    if (isEchoOfFollowing(leader)) return
    const previousScrollLeft = follower.scrollLeft
    follower.scrollLeft = leader.scrollLeft
    const hasFollowerMoved = follower.scrollLeft !== previousScrollLeft
    if (hasFollowerMoved) scrollLeftWrittenByFollowing.set(follower, follower.scrollLeft)
  }

  const secondFollowsFirst = follow(first, second)
  const firstFollowsSecond = follow(second, first)
  first.addEventListener("scroll", secondFollowsFirst, PASSIVE_LISTENER)
  second.addEventListener("scroll", firstFollowsSecond, PASSIVE_LISTENER)

  return () => {
    first.removeEventListener("scroll", secondFollowsFirst)
    second.removeEventListener("scroll", firstFollowsSecond)
  }
}
