export const SPLITS_VIEW = {
  Accumulated: "accumulated",
  Radios: "radios",
  Splits: "splits",
  TimeLoss: "timeLoss",
} as const

export type SplitsView = (typeof SPLITS_VIEW)[keyof typeof SPLITS_VIEW]

export type SplitsViewConfig = {
  isExperimental: boolean
  onlyRadios: boolean
  requiresChipDownload: boolean
  showCumulative: boolean
  timeLossEnabled: boolean
}

export const SPLITS_VIEW_CONFIG: Record<SplitsView, SplitsViewConfig> = {
  [SPLITS_VIEW.Accumulated]: {
    isExperimental: false,
    onlyRadios: false,
    requiresChipDownload: true,
    showCumulative: true,
    timeLossEnabled: false,
  },
  [SPLITS_VIEW.Radios]: {
    isExperimental: true,
    onlyRadios: true,
    requiresChipDownload: false,
    showCumulative: false,
    timeLossEnabled: false,
  },
  [SPLITS_VIEW.Splits]: {
    isExperimental: false,
    onlyRadios: false,
    requiresChipDownload: true,
    showCumulative: false,
    timeLossEnabled: false,
  },
  [SPLITS_VIEW.TimeLoss]: {
    isExperimental: true,
    onlyRadios: false,
    requiresChipDownload: true,
    showCumulative: false,
    timeLossEnabled: true,
  },
}

const VIEWS_WITHOUT_RADIOS: readonly SplitsView[] = [
  SPLITS_VIEW.Splits,
  SPLITS_VIEW.Accumulated,
  SPLITS_VIEW.TimeLoss,
]

export function availableSplitsViews(hasRadios: boolean): readonly SplitsView[] {
  return hasRadios ? [SPLITS_VIEW.Radios, ...VIEWS_WITHOUT_RADIOS] : VIEWS_WITHOUT_RADIOS
}

export function defaultSplitsView(hasRadios: boolean): SplitsView {
  return hasRadios ? SPLITS_VIEW.Radios : SPLITS_VIEW.Splits
}
