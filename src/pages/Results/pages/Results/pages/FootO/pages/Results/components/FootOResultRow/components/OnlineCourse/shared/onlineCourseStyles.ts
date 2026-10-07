import { OnlineCourseNode } from "../../../../../shared/onlineCourse/onlineCourse.ts"

export const PROGRESS_COLOR_CLASS_NAME = [
  "text-neutral-400",
  "transition-colors",
  "duration-500",
  "motion-reduce:transition-none",
  "data-[progress=reached]:text-course",
].join(" ")

export interface OnlineCourseSymbolProps {
  node: OnlineCourseNode
  x: number
}
