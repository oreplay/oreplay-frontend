import { columnWidthsWithGutters } from "./columnWidths.ts"

export default function syncColumnWidths(sourceRow: HTMLElement, targetColumns: HTMLElement) {
  const sourceCells = Array.from(sourceRow.children)
  const columns = Array.from(targetColumns.querySelectorAll<HTMLElement>("col"))

  const copyWidths = () => {
    const widths = columnWidthsWithGutters(
      sourceRow.getBoundingClientRect(),
      sourceCells.map((cell) => cell.getBoundingClientRect()),
    )
    widths.slice(0, columns.length).forEach((width, index) => {
      columns[index].style.width = `${width}px`
    })
  }

  const observer = new ResizeObserver(copyWidths)
  observer.observe(sourceRow)
  sourceCells.forEach((cell) => observer.observe(cell))
  copyWidths()

  return () => observer.disconnect()
}
