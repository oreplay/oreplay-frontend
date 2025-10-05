import { ReactNode, useEffect, useState } from "react"
import { DateTime } from "luxon"
import { NowContext } from "../../../shared/context.ts"

type NowProviderProps = {
  children: ReactNode
}

export default function NowProvider({ children }: NowProviderProps) {
  const [now, setNow] = useState<DateTime>(DateTime.now())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(DateTime.now())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>
}
