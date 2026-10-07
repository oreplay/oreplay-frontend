import { useCallback, useMemo, useState } from "react"
import {
  DEFAULT_ONLINE_COURSE_VISIBILITY,
  onlineCourseVisibilityStorageKey,
  parseOnlineCourseVisibility,
  serializeOnlineCourseVisibility,
} from "./onlineCourseVisibility.ts"

type VisibilityByStorageKey = Record<string, boolean>

const NO_CHOSEN_VISIBILITY: VisibilityByStorageKey = {}

/**
 * Reads the choice of showing the online course from the browser storage.
 *
 * @param storageKey Key the choice is stored under.
 * @returns The stored choice, or the default one when there is none or the storage is unavailable.
 */
function readOnlineCourseVisibility(storageKey: string) {
  try {
    return parseOnlineCourseVisibility(localStorage.getItem(storageKey))
  } catch {
    return DEFAULT_ONLINE_COURSE_VISIBILITY
  }
}

/**
 * Stores the choice of showing the online course in the browser storage. An unavailable storage
 * is ignored, so the choice then lasts only while the page is open.
 *
 * @param storageKey Key the choice is stored under.
 * @param isVisible Whether the online course is shown.
 */
function writeOnlineCourseVisibility(storageKey: string, isVisible: boolean) {
  try {
    localStorage.setItem(storageKey, serializeOnlineCourseVisibility(isVisible))
  } catch {
    return
  }
}

/**
 * Keeps whether the online course is shown for an event, remembered in the browser per event.
 *
 * @param eventId Id of the event the choice belongs to.
 * @returns Whether the online course is shown and how to switch it.
 */
export default function useOnlineCourseVisibility(eventId: string) {
  const storageKey = onlineCourseVisibilityStorageKey(eventId)
  const storedVisibility = useMemo(() => readOnlineCourseVisibility(storageKey), [storageKey])
  const [chosenVisibility, setChosenVisibility] = useState(NO_CHOSEN_VISIBILITY)
  const isOnlineCourseVisible = chosenVisibility[storageKey] ?? storedVisibility

  const toggleOnlineCourseVisibility = useCallback(() => {
    const isVisibleAfterToggle = !isOnlineCourseVisible
    writeOnlineCourseVisibility(storageKey, isVisibleAfterToggle)
    setChosenVisibility((chosen) => ({ ...chosen, [storageKey]: isVisibleAfterToggle }))
  }, [isOnlineCourseVisible, storageKey])

  return { isOnlineCourseVisible, toggleOnlineCourseVisibility }
}
