/**
 * Element id of an option of a segmented selector, used to move the keyboard focus to it.
 *
 * @param selectorId Id that is unique to the selector on the page.
 * @param optionKey Key of the option inside the selector.
 * @returns An id that no other option on the page shares.
 */
export function segmentedSelectorOptionId(selectorId: string, optionKey: string): string {
  return `${selectorId}-option-${optionKey}`
}
