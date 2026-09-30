import { useMemo } from "react"
import { isMobileDevice } from "./isMobileDevice.ts"

export function useIsMobileDevice() {
  return useMemo(() => isMobileDevice(navigator), [])
}
