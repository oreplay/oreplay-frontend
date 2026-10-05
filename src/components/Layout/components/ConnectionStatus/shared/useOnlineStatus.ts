import { useSyncExternalStore } from "react"

const CONNECTIVITY_EVENTS = ["online", "offline"] as const

function subscribeToConnectivity(onChange: () => void) {
  CONNECTIVITY_EVENTS.forEach((event) => window.addEventListener(event, onChange))
  return () => CONNECTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, onChange))
}

const isNavigatorOnline = () => navigator.onLine

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribeToConnectivity, isNavigatorOnline)
}
