export interface HorizontalBounds {
  left: number
  right: number
}

export function columnWidthsWithGutters(row: HorizontalBounds, cells: HorizontalBounds[]) {
  if (cells.length === 0) return []
  const leadingGutter = Math.max(0, cells[0].left - row.left)
  const trailingGutter = Math.max(0, row.right - cells[cells.length - 1].right)
  const cellWidths = cells.map((cell) => cell.right - cell.left)
  return [leadingGutter, ...cellWidths, trailingGutter]
}
