export const CLOSE_KEY = "Escape"
export const MOUSE_POINTER_TYPE = "mouse"

/**
 * Whether the explanation of an info tip is on screen. A mouse shows it just by hovering its icon; a
 * click or a tap pins it, so it also works on touch screens and stays open while it is read.
 *
 * @param isHovered Whether a mouse pointer is over the icon or the explanation.
 * @param isPinned Whether the user pinned the explanation open with a click or a tap.
 * @returns `true` when the explanation has to be shown.
 */
export function isInfoTipVisible(isHovered: boolean, isPinned: boolean): boolean {
  return isHovered || isPinned
}

/**
 * Whether a pointer event comes from a mouse. Touch screens fire the same events on a tap, where
 * there is no hovering, so those have to be ignored.
 *
 * @param pointerType The `pointerType` of the pointer event.
 * @returns `true` for a mouse, `false` for touch and pen.
 */
export function isMousePointer(pointerType: string): boolean {
  return pointerType === MOUSE_POINTER_TYPE
}
