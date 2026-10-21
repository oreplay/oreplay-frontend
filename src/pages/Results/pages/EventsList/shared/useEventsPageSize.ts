import { useState } from "react"
import { useTheme } from "@mui/material"
import { useIsMobileDevice } from "../../../shared/useIsMobileDevice.ts"
import { desktopEventsPageSize, MOBILE_EVENTS_PAGE_SIZE } from "./eventsGridLayout.ts"

/**
 * Decides how many events each page of the events list fetches. Mobile devices fetch a fixed small
 * page; desktop fetches a fixed number of full grid rows for the window width it was opened at, and
 * keeps that size if the window is resized later.
 *
 * @returns Events per page.
 */
export function useEventsPageSize(): number {
  const isMobile = useIsMobileDevice()
  const breakpoints = useTheme().breakpoints.values
  const [desktopPageSize] = useState(() => desktopEventsPageSize(window.innerWidth, breakpoints))

  return isMobile ? MOBILE_EVENTS_PAGE_SIZE : desktopPageSize
}
