export const RESULT_LIST_BOTTOM_GAP_PX = 72
export const RESULT_LIST_MIN_HEIGHT_PX = 320

export function computeResultListHeight(viewportHeight: number, listDocumentTop: number) {
  const availableHeight = viewportHeight - listDocumentTop - RESULT_LIST_BOTTOM_GAP_PX
  return Math.max(RESULT_LIST_MIN_HEIGHT_PX, Math.round(availableHeight))
}
