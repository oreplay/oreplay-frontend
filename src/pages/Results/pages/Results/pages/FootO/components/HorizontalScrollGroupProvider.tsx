import { ReactNode, useState } from "react"
import createHorizontalScrollGroup from "../shared/horizontalScroll/createHorizontalScrollGroup.ts"
import { HorizontalScrollGroupContext } from "../shared/horizontalScroll/HorizontalScrollGroupContext.ts"
import useWatchHorizontalScrollReorders from "../shared/horizontalScroll/useWatchHorizontalScrollReorders.ts"

interface HorizontalScrollGroupProviderProps {
  children: ReactNode
}

/**
 * Gives its children one group of horizontal scrollers that move together and keep their
 * position when the children are reordered. Its wrapper takes no part in the layout.
 *
 * @param props.children Content whose scrollers join the group.
 */
export default function HorizontalScrollGroupProvider({
  children,
}: HorizontalScrollGroupProviderProps) {
  const [group] = useState(createHorizontalScrollGroup)
  const watchReorders = useWatchHorizontalScrollReorders<HTMLDivElement>(group)

  return (
    <HorizontalScrollGroupContext.Provider value={group}>
      <div className="contents" ref={watchReorders}>
        {children}
      </div>
    </HorizontalScrollGroupContext.Provider>
  )
}
