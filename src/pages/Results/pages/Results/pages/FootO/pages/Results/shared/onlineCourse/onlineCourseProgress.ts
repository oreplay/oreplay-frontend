import {
  IN_PROGRESS_LEG_FILL_RATIO,
  ONLINE_COURSE_NODE_KIND,
  ONLINE_COURSE_PROGRESS,
  OnlineCourse,
  OnlineCourseNode,
  OnlineCourseProgress,
} from "./onlineCourse.ts"

const LEG_FILL_RATIO_BY_PROGRESS: Record<OnlineCourseProgress, number> = {
  [ONLINE_COURSE_PROGRESS.InProgress]: IN_PROGRESS_LEG_FILL_RATIO,
  [ONLINE_COURSE_PROGRESS.Pending]: 0,
  [ONLINE_COURSE_PROGRESS.Reached]: 1,
}

function isControl(node: OnlineCourseNode) {
  return node.kind === ONLINE_COURSE_NODE_KIND.Control
}

function isReached(node: OnlineCourseNode) {
  return node.progress === ONLINE_COURSE_PROGRESS.Reached
}

export function countControls(course: OnlineCourse): number {
  return course.nodes.filter(isControl).length
}

export function countReachedControls(course: OnlineCourse): number {
  return course.nodes.filter(isControl).filter(isReached).length
}

export function legFillRatio(progress: OnlineCourseProgress): number {
  return LEG_FILL_RATIO_BY_PROGRESS[progress]
}
