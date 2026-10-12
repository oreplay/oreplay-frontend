export const AXIS_LABEL_CHARACTER_WIDTH_PX = 6.5
export const AXIS_LEGEND_WIDTH_PX = 20
export const AXIS_TICK_SPACE_PX = 14
export const CHART_RIGHT_MARGIN_PX = 16

/**
 * Room a vertical axis needs beside the plot, so its labels fit without leaving the wide empty
 * strip a fixed margin would.
 *
 * @param labels Every label written on the axis.
 * @param hasLegend Whether the axis also carries a legend written along it.
 * @returns The margin in whole pixels.
 */
export function verticalAxisMarginPx(
  labels: readonly string[],
  hasLegend: boolean = false,
): number {
  const longestLabelLength = Math.max(0, ...labels.map((label) => label.length))
  const legendWidth = hasLegend ? AXIS_LEGEND_WIDTH_PX : 0
  return Math.ceil(
    longestLabelLength * AXIS_LABEL_CHARACTER_WIDTH_PX + AXIS_TICK_SPACE_PX + legendWidth,
  )
}

/**
 * Width of the plot itself, once the room of the axes on both sides is taken off the chart.
 *
 * @param chartWidthPx Width of the whole chart in pixels.
 * @param leftMarginPx Room taken by the left axis, in pixels.
 * @param rightMarginPx Room taken on the right, in pixels.
 * @returns The plot width in pixels, never negative.
 */
export function plotWidthPx(
  chartWidthPx: number,
  leftMarginPx: number,
  rightMarginPx: number,
): number {
  return Math.max(0, chartWidthPx - leftMarginPx - rightMarginPx)
}
