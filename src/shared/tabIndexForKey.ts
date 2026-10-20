const FIRST_TAB_KEY = "Home"
const LAST_TAB_KEY = "End"
const NEXT_TAB_KEY = "ArrowRight"
const PREVIOUS_TAB_KEY = "ArrowLeft"

/**
 * Index of the tab that a key press moves the selection to, so a row of tabs behaves like the
 * WAI-ARIA tabs and radio group patterns. The arrows wrap around at both ends.
 *
 * @param pressedKey `KeyboardEvent.key` of the key pressed.
 * @param currentIndex Index of the tab currently selected.
 * @param total Number of tabs in the row.
 * @returns The index to select, or `null` when the key does not move the selection.
 */
export function tabIndexForKey(pressedKey: string, currentIndex: number, total: number) {
  switch (pressedKey) {
    case NEXT_TAB_KEY:
      return (currentIndex + 1) % total
    case PREVIOUS_TAB_KEY:
      return (currentIndex - 1 + total) % total
    case FIRST_TAB_KEY:
      return 0
    case LAST_TAB_KEY:
      return total - 1
    default:
      return null
  }
}
