export const OFFICIAL_CHIP_SIZE = {
  Compact: "compact",
  Regular: "regular",
} as const

export type OfficialChipSize = (typeof OFFICIAL_CHIP_SIZE)[keyof typeof OFFICIAL_CHIP_SIZE]

export interface OfficialChipDimensions {
  heightPx: number
  iconPx: number
  labelPx: number
  paddingLeftPx: number
  paddingRightPx: number
  gapPx: number
}

const OFFICIAL_CHIP_DIMENSIONS: Record<OfficialChipSize, OfficialChipDimensions> = {
  [OFFICIAL_CHIP_SIZE.Compact]: {
    heightPx: 18,
    iconPx: 12,
    labelPx: 11,
    paddingLeftPx: 4,
    paddingRightPx: 6,
    gapPx: 3,
  },
  [OFFICIAL_CHIP_SIZE.Regular]: {
    heightPx: 28,
    iconPx: 18,
    labelPx: 13,
    paddingLeftPx: 8,
    paddingRightPx: 12,
    gapPx: 6,
  },
}

/**
 * Looks up the pixel measurements of the "Official" chip for a size. The compact size is meant for
 * tight spots like table rows; the regular size for standalone placements.
 * @param size Which variant of the chip is being drawn.
 * @returns The chip's height, icon and label sizes, side paddings and icon-label gap, in pixels.
 */
export function getOfficialChipDimensions(size: OfficialChipSize): OfficialChipDimensions {
  return OFFICIAL_CHIP_DIMENSIONS[size]
}
