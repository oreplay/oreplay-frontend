export const IN_PROGRESS_LEG_FILL_RATIO = 0.3

export const ONLINE_COURSE_NODE_KIND = {
  Control: "control",
  Finish: "finish",
  Start: "start",
} as const

export const ONLINE_COURSE_PROGRESS = {
  InProgress: "in-progress",
  Pending: "pending",
  Reached: "reached",
} as const

export interface OnlineCourse {
  legs: OnlineCourseLeg[]
  nodes: OnlineCourseNode[]
}

export interface OnlineCourseLeg {
  progress: OnlineCourseProgress
}

export interface OnlineCourseNode {
  behindSeconds: number | null
  cumulativeSeconds: number | null
  kind: OnlineCourseNodeKind
  label: string | null
  progress: OnlineCourseNodeProgress
}

export type OnlineCourseNodeKind =
  (typeof ONLINE_COURSE_NODE_KIND)[keyof typeof ONLINE_COURSE_NODE_KIND]

export type OnlineCourseNodeProgress = Exclude<
  OnlineCourseProgress,
  typeof ONLINE_COURSE_PROGRESS.InProgress
>

export type OnlineCourseProgress =
  (typeof ONLINE_COURSE_PROGRESS)[keyof typeof ONLINE_COURSE_PROGRESS]
