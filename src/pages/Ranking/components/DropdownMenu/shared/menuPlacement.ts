export const MENU_PLACEMENTS = ["above", "below"] as const
export type MenuPlacement = (typeof MENU_PLACEMENTS)[number]

export const MENU_GAP_PX = 4

interface MenuPlacementInput {
  triggerTop: number
  triggerBottom: number
  menuHeight: number
  viewportHeight: number
}

export function menuPlacement({
  triggerTop,
  triggerBottom,
  menuHeight,
  viewportHeight,
}: MenuPlacementInput): MenuPlacement {
  const fitsBelow = triggerBottom + MENU_GAP_PX + menuHeight <= viewportHeight
  const fitsAbove = triggerTop - MENU_GAP_PX - menuHeight >= 0
  return !fitsBelow && fitsAbove ? "above" : "below"
}
