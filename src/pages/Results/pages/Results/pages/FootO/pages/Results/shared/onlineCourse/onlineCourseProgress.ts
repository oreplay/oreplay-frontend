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

/**
 * Tells whether a node is an online control, as opposed to the start or the finish.
 *
 * @param node Node to check.
 * @returns `true` for a control.
 */
function isControl(node: OnlineCourseNode) {
  return node.kind === ONLINE_COURSE_NODE_KIND.Control
}

/**
 * Tells whether the runner has reached a node.
 *
 * @param node Node to check.
 * @returns `true` for a reached node.
 */
function isReached(node: OnlineCourseNode) {
  return node.progress === ONLINE_COURSE_PROGRESS.Reached
}

/**
 * Counts the online controls of a course.
 *
 * @param course Course to count the controls of.
 * @returns The number of controls, without the start and the finish.
 */
export function countControls(course: OnlineCourse): number {
  return course.nodes.filter(isControl).length
}

/**
 * Counts the online controls of a course the runner has reached.
 *
 * @param course Course to count the controls of.
 * @returns The number of reached controls.
 */
export function countReachedControls(course: OnlineCourse): number {
  return course.nodes.filter(isControl).filter(isReached).length
}

/**
 * Tells how much of a leg is drawn as travelled.
 *
 * @param progress Progress of the runner on the leg.
 * @returns A ratio from `0` to `1`.
 */
export function legFillRatio(progress: OnlineCourseProgress): number {
  return LEG_FILL_RATIO_BY_PROGRESS[progress]
}
