/** Key React Router gives the location a visit starts on, before any navigation inside the app. */
const FIRST_LOCATION_KEY = "default"

/**
 * Tells whether going back stays inside the app: false on the first page of a visit, as when the
 * page is opened from a shared link or a QR code.
 * @param locationKey The `key` of the current React Router location.
 * @returns `true` when there is a previous page of the app to go back to.
 */
export function hasInAppHistory(locationKey: string): boolean {
  return locationKey !== FIRST_LOCATION_KEY
}
