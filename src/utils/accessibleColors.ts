/**
 * Accessible color palette for charts
 * Colors are selected to be color-blind friendly and provide good contrast
 * Based on Paul Tol's qualitative color scheme recommendations
 */

export const ACCESSIBLE_COLORS = [
  "#4477aa", // Blue
  "#ee6677", // Red
  "#228833", // Green
  "#ccbb44", // Yellow
  "#66ccee", // Cyan
  "#aa3377", // Purple
  "#ee8866", // Orange
  "#000000", // Black
  "#994455", // Dark Rose
  "#44aa99", // Teal
  "#117733", // Dark Green
  "#882255", // Dark Magenta
  "#661100", // Brown
  "#8888cc", // Lavender
  "#ddcc77", // Sand
  "#332288", // Indigo
] as const
/**
 * Gets a color from the accessible palette by index
 * Cycles through the palette if more colors are needed than available
 */
export function getAccessibleColor(index: number): string {
  return ACCESSIBLE_COLORS[index % ACCESSIBLE_COLORS.length]
}

/**
 * Gets an array of accessible colors for a given count
 */
export function getAccessibleColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getAccessibleColor(i))
}

/**
 * Color palette configuration for different chart types
 */
export const CHART_COLOR_CONFIGS = {
  line: {
    colors: ACCESSIBLE_COLORS,
    scheme: "set1" as const,
  },
  bar: {
    errorFreeTime: "#228833", // Green for good performance
    errorTime: "#ee6677", // Red for errors/loss
    theoreticalTime: "#ccbb44", // Yellow for theoretical
  },
  position: {
    colors: ACCESSIBLE_COLORS,
    scheme: "set1" as const,
  },
} as const
