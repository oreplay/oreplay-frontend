import { Gender } from "./Gender.ts"

export const CATEGORY_OFFICIAL_SUB20 = "officialSub20"
export const CATEGORY_OFFICIAL_SENIOR = "officialSenior"
export const CATEGORY_OTHERS = "others"

export type CategoryName =
  | typeof CATEGORY_OFFICIAL_SUB20
  | typeof CATEGORY_OFFICIAL_SENIOR
  | typeof CATEGORY_OTHERS

export type CategoryData = Record<
  Gender,
  {
    total: number
    dns: number
    mp: number
    dnf: number
    ot: number
    dqf: number
    notYetFinished: number
    finished: number
    others: number
  }
>

export type ApiStats = Record<CategoryName, CategoryData>
