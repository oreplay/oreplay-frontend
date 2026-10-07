export const SPLITS_TOOLBAR_CONTROL_HEIGHT_CLASS = "box-border h-11"

export const SPLITS_TOOLBAR_HEIGHT_PX = 60

/**
 * Sticky `top` offset of the splits table header, so it sticks right below the toolbar.
 *
 * @param toolbarStickyTopPx Sticky `top` offset of the toolbar, in pixels.
 * @returns The offset of the table header in pixels.
 */
export function splitsTableHeaderStickyTopPx(toolbarStickyTopPx: number): number {
  return toolbarStickyTopPx + SPLITS_TOOLBAR_HEIGHT_PX
}
