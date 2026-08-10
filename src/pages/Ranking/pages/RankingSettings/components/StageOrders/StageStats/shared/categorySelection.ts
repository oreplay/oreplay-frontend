import { GetListFedoStatsParams } from "../../../../../../../../domain/types/v1api"

export const OFFICIAL_BUCKETS = ["sub20M", "sub20F", "seniorM", "seniorF"] as const
export type OfficialBucket = (typeof OFFICIAL_BUCKETS)[number]

export const CATEGORY_BUCKETS = ["sub20M", "sub20F", "seniorM", "seniorF", "others"] as const
export type CategoryBucket = (typeof CATEGORY_BUCKETS)[number]

export type CategorySelection = Record<CategoryBucket, string[]>

export const EMPTY_SELECTION: CategorySelection = {
  sub20M: [],
  sub20F: [],
  seniorM: [],
  seniorF: [],
  others: [],
}

const DEFAULTS: Record<OfficialBucket, string[]> = {
  sub20M: ["U-10", "M-12", "M-14", "M-16", "M-16/18", "M-18E", "M-18", "M-20E", "M-20"],
  sub20F: ["U-10", "F-12", "F-14", "F-16", "F-16/18", "F-18E", "F-18", "F-20E", "F-20"],
  seniorM: [
    "M-E",
    "M-S",
    "S",
    "M-21",
    "M-21A",
    "M-21B",
    "M-35",
    "M-35B",
    "M-35A",
    "M-40",
    "M-45",
    "M-50",
    "M-55",
    "M-60",
    "M-65",
    "M-70",
    "M-75",
    "M-80",
    "M-85",
    "M-90",
    "M-95",
  ],
  seniorF: [
    "F-E",
    "F-S",
    "F-21",
    "F-21A",
    "F-21B",
    "F-35",
    "F-35B",
    "F-35A",
    "F-40",
    "F-45",
    "F-50",
    "F-55",
    "F-60",
    "F-65",
    "F-70",
    "F-75",
    "F-80",
    "F-85",
    "F-90",
    "F-95",
  ],
}

export function initialSelection(classNames: string[]): CategorySelection {
  const selection: CategorySelection = {
    sub20M: [],
    sub20F: [],
    seniorM: [],
    seniorF: [],
    others: [],
  }
  classNames.forEach((name) => {
    const bucket = OFFICIAL_BUCKETS.find((candidate) => DEFAULTS[candidate].includes(name))
    selection[bucket ?? "others"].push(name)
  })
  return selection
}

/** Moves a class into `toBucket`, removing it from wherever it currently is. */
export function moveClass(
  selection: CategorySelection,
  className: string,
  toBucket: CategoryBucket,
): CategorySelection {
  const next: CategorySelection = { sub20M: [], sub20F: [], seniorM: [], seniorF: [], others: [] }
  CATEGORY_BUCKETS.forEach((bucket) => {
    const without = selection[bucket].filter((name) => name !== className)
    next[bucket] = bucket === toBucket ? [...without, className] : without
  })
  return next
}

export function toFedoStatsParams(selection: CategorySelection): GetListFedoStatsParams {
  return {
    officialSub20M: selection.sub20M.join(","),
    officialSub20F: selection.sub20F.join(","),
    officialSeniorM: selection.seniorM.join(","),
    officialSeniorF: selection.seniorF.join(","),
  }
}
