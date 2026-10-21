import { useCallback, useRef } from "react"
import { HorizontalScrollGroup } from "./createHorizontalScrollGroup.ts"

/**
 * Builds the ref of the element whose reorders a scroll group has to watch, so the scrollers
 * inside keep their position when the list moves them.
 *
 * @param group Scroll group the scrollers inside the element belong to.
 * @returns A ref callback for the element that holds the reorderable list.
 */
export default function useWatchHorizontalScrollReorders<Container extends HTMLElement>(
  group: HorizontalScrollGroup,
) {
  const stopWatchingRef = useRef<(() => void) | null>(null)

  return useCallback(
    (container: Container | null) => {
      stopWatchingRef.current?.()
      stopWatchingRef.current = container ? group.watchReorders(container) : null
    },
    [group],
  )
}
