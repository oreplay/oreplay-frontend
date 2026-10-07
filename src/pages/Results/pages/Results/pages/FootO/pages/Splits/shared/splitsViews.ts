export const SPLITS_VIEW = {
  Accumulated: "accumulated",
  Radios: "radios",
  Splits: "splits",
} as const

export type SplitsView = (typeof SPLITS_VIEW)[keyof typeof SPLITS_VIEW]

export type SplitsViewConfig = {
  onlyRadios: boolean
  requiresChipDownload: boolean
  showCumulative: boolean
  supportsTimeLoss: boolean
}

export const SPLITS_VIEW_CONFIG: Record<SplitsView, SplitsViewConfig> = {
  [SPLITS_VIEW.Accumulated]: {
    onlyRadios: false,
    requiresChipDownload: true,
    showCumulative: true,
    supportsTimeLoss: true,
  },
  [SPLITS_VIEW.Radios]: {
    onlyRadios: true,
    requiresChipDownload: false,
    showCumulative: false,
    supportsTimeLoss: false,
  },
  [SPLITS_VIEW.Splits]: {
    onlyRadios: false,
    requiresChipDownload: true,
    showCumulative: false,
    supportsTimeLoss: true,
  },
}

const VIEWS_WITHOUT_RADIOS: readonly SplitsView[] = [SPLITS_VIEW.Splits, SPLITS_VIEW.Accumulated]

export function availableSplitsViews(hasRadios: boolean): readonly SplitsView[] {
  return hasRadios ? [SPLITS_VIEW.Radios, ...VIEWS_WITHOUT_RADIOS] : VIEWS_WITHOUT_RADIOS
}

export function defaultSplitsView(hasRadios: boolean): SplitsView {
  return hasRadios ? SPLITS_VIEW.Radios : SPLITS_VIEW.Splits
}

export function showsTimeLoss(view: SplitsView, isTimeLossOn: boolean): boolean {
  return isTimeLossOn && SPLITS_VIEW_CONFIG[view].supportsTimeLoss
}

export function splitsViewOptionId(view: SplitsView): string {
  return `splits-view-option-${view}`
}
