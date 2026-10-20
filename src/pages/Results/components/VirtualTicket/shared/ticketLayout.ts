export const STAT_SIZE = {
  Detail: "detail",
  Large: "large",
  LargeMuted: "largeMuted",
  Small: "small",
} as const
export type StatSize = (typeof STAT_SIZE)[keyof typeof STAT_SIZE]

const LARGE_VALUE_CLASS = "text-[22px] leading-9 sm:text-[26px] sm:leading-10"

export const STAT_VALUE_CLASS: Record<StatSize, string> = {
  [STAT_SIZE.Detail]: "text-[13px] text-neutral-600",
  [STAT_SIZE.Large]: `${LARGE_VALUE_CLASS} font-semibold text-neutral-900`,
  [STAT_SIZE.LargeMuted]: `${LARGE_VALUE_CLASS} font-medium text-neutral-600`,
  [STAT_SIZE.Small]: "text-sm font-semibold text-neutral-800 sm:text-[15px]",
}

export const STAT_GAP_CLASS: Record<StatSize, string> = {
  [STAT_SIZE.Detail]: "gap-0.5",
  [STAT_SIZE.Large]: "gap-1 sm:gap-1.5",
  [STAT_SIZE.LargeMuted]: "gap-1 sm:gap-1.5",
  [STAT_SIZE.Small]: "gap-0.5",
}

export const TICKET_GRID_CLASS = "grid grid-cols-3 gap-x-2 sm:gap-x-3"

export const TYPOGRAPHY_INHERIT = { font: "inherit", color: "inherit", letterSpacing: "inherit" }
