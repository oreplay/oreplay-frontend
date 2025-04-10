export const GENDERS = ["M", "F"] as const
export type Gender = (typeof GENDERS)[number]
