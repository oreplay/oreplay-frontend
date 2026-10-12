interface PositionChartSeries {
  data: readonly { x: string }[]
}

/**
 * Controls on the x axis of the position chart, in the order the chart draws them: each control
 * once, by first appearance across the series.
 *
 * @param series Series plotted in the chart.
 * @returns The x value of every control, without repetitions.
 */
export function positionChartControls(series: readonly PositionChartSeries[]): string[] {
  return [...new Set(series.flatMap((runnerSeries) => runnerSeries.data.map((point) => point.x)))]
}

/**
 * Label of a position on the axis of the position chart, such as `3°`.
 *
 * @param position Position in the class; fractional values are rounded.
 * @returns The label.
 */
export function positionLabel(position: number): string {
  return `${Math.round(position)}°`
}
