import { ReactNode, useState } from "react"
import createHorizontalScrollGroup from "../shared/horizontalScroll/createHorizontalScrollGroup.ts"
import { HorizontalScrollGroupContext } from "../shared/horizontalScroll/HorizontalScrollGroupContext.ts"

interface HorizontalScrollGroupProviderProps {
  children: ReactNode
}

export default function HorizontalScrollGroupProvider({
  children,
}: HorizontalScrollGroupProviderProps) {
  const [group] = useState(createHorizontalScrollGroup)

  return (
    <HorizontalScrollGroupContext.Provider value={group}>
      {children}
    </HorizontalScrollGroupContext.Provider>
  )
}
