import { useCallback, useContext, useRef } from "react"
import { HorizontalScrollGroupContext } from "./HorizontalScrollGroupContext.ts"

export default function useJoinHorizontalScrollGroup<Scroller extends HTMLElement>() {
  const group = useContext(HorizontalScrollGroupContext)
  const leaveGroupRef = useRef<(() => void) | null>(null)

  return useCallback(
    (scroller: Scroller | null) => {
      leaveGroupRef.current?.()
      leaveGroupRef.current = scroller && group ? group.join(scroller) : null
    },
    [group],
  )
}
