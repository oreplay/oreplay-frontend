export const DEFAULT_ONLINE_COURSE_VISIBILITY = true

const ONLINE_COURSE_VISIBILITY_STORAGE_PREFIX = "onlineCourseVisibility"

/**
 * Builds the key the visibility of the online course of an event is stored under.
 *
 * @param eventId Id of the event the choice belongs to.
 * @returns The storage key, different for every event.
 */
export function onlineCourseVisibilityStorageKey(eventId: string) {
  return `${ONLINE_COURSE_VISIBILITY_STORAGE_PREFIX}:${eventId}`
}

/**
 * Reads the stored choice of showing the online course.
 *
 * @param raw Stored value, `null` when nothing has been stored yet.
 * @returns The stored choice, or the default one when the value is missing or not a choice.
 */
export function parseOnlineCourseVisibility(raw: string | null) {
  if (raw === String(true)) return true
  if (raw === String(false)) return false
  return DEFAULT_ONLINE_COURSE_VISIBILITY
}

/**
 * Turns the choice of showing the online course into the value to store.
 *
 * @param isVisible Whether the online course is shown.
 * @returns The value `parseOnlineCourseVisibility` reads back.
 */
export function serializeOnlineCourseVisibility(isVisible: boolean) {
  return String(isVisible)
}
