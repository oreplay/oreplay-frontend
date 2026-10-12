/**
 * Label of a position on the axis of the position chart, such as `3°`.
 *
 * @param position Position in the class; fractional values are rounded.
 * @returns The label.
 */
export function positionLabel(position: number): string {
  return `${Math.round(position)}°`
}
