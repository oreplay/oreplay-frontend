import { useEffect, useState } from "react"
import {
  BACK_ONLINE_DISPLAY_MS,
  ConnectionBarState,
  connectionBarOnConnectivityChange,
  hideConnectionBar,
  initialConnectionBar,
  isShowingBackOnline,
} from "./connectionBar.ts"

export function useConnectionBar(isOnline: boolean): ConnectionBarState {
  const [bar, setBar] = useState(() => initialConnectionBar(isOnline))

  useEffect(() => {
    setBar((current) => connectionBarOnConnectivityChange(current, isOnline))
  }, [isOnline])

  useEffect(() => {
    if (!isShowingBackOnline(bar)) return
    const timer = setTimeout(() => setBar(hideConnectionBar), BACK_ONLINE_DISPLAY_MS)
    return () => clearTimeout(timer)
  }, [bar])

  return bar
}
