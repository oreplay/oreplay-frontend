import { runnerService } from "../../../../../../../../../../domain/services/RunnerService.ts"
import {
  ProcessedRunnerModel,
  RadioSplitModel,
} from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  ONLINE_COURSE_NODE_KIND,
  ONLINE_COURSE_PROGRESS,
  OnlineCourse,
  OnlineCourseLeg,
  OnlineCourseLiveTiming,
  OnlineCourseNode,
  OnlineCourseNodeProgress,
} from "./onlineCourse.ts"

const NO_SPLIT_REACHED_INDEX = -1
const START_NODE_INDEX = 0
const START_NODE_COUNT = 1

/**
 * Tells whether an online split has been read.
 *
 * @param split Online split to check.
 * @returns `true` when the split has a time since the start.
 */
function hasReading(split: RadioSplitModel) {
  return split.cumulative_time !== null
}

/**
 * Tells whether a runner finished with a result that keeps their whole course valid.
 *
 * @param runner Runner to check.
 * @returns `true` for a finished runner whose status is OK or out of competition.
 */
function hasFinishedClassified(runner: ProcessedRunnerModel) {
  const isClassifiedStatus = runnerService.isOK(runner) || runnerService.isNC(runner)
  return runnerService.hasFinished(runner) && isClassifiedStatus
}

/**
 * Tells whether a runner can still be out on the course.
 *
 * @param runner Runner to check.
 * @returns `true` for a runner with an OK status that has not finished.
 */
function isStillRunning(runner: ProcessedRunnerModel) {
  return !runnerService.hasFinished(runner) && runnerService.isOK(runner)
}

/**
 * Finds the last online split a runner is known to have reached.
 *
 * A runner that finished classified has reached the finish, even without online readings.
 *
 * @param runner Runner the splits belong to.
 * @param splits Online splits of the runner, the finish last.
 * @returns The index of the split, or `-1` when the runner has reached none.
 */
function furthestReachedSplitIndex(runner: ProcessedRunnerModel, splits: RadioSplitModel[]) {
  const finishSplitIndex = splits.length - 1
  if (hasFinishedClassified(runner)) return finishSplitIndex
  return splits.map(hasReading).lastIndexOf(true)
}

/**
 * Translates whether a node has been reached into its progress.
 *
 * @param isReached Whether the runner has reached the node.
 * @returns `reached` or `pending`.
 */
function nodeProgress(isReached: boolean): OnlineCourseNodeProgress {
  return isReached ? ONLINE_COURSE_PROGRESS.Reached : ONLINE_COURSE_PROGRESS.Pending
}

/**
 * Computes how far behind the best time a reading is.
 *
 * @param cumulativeSeconds Time since the start at the control, or `null` without a reading.
 * @param bestSeconds Best time at the control, or `null`/`undefined` without a reference.
 * @returns The difference in seconds, or `null` when either time is missing.
 */
function behindSeconds(cumulativeSeconds: number | null, bestSeconds: number | null | undefined) {
  if (cumulativeSeconds === null || bestSeconds === null || bestSeconds === undefined) return null
  return cumulativeSeconds - bestSeconds
}

/**
 * Builds the node of the start triangle, which never has times.
 *
 * @param isReached Whether the runner has left the start.
 * @returns The start node.
 */
function buildStartNode(isReached: boolean): OnlineCourseNode {
  return {
    behindSeconds: null,
    cumulativeSeconds: null,
    kind: ONLINE_COURSE_NODE_KIND.Start,
    label: null,
    liveTiming: null,
    progress: nodeProgress(isReached),
  }
}

/**
 * Builds what is needed to time live the control a runner is heading to.
 *
 * @param runner Runner heading to the control.
 * @param bestSeconds Best time at the control, or `null`/`undefined` without a reference.
 * @returns The live timing, or `null` for a runner without a start time.
 */
function buildLiveTiming(
  runner: ProcessedRunnerModel,
  bestSeconds: number | null | undefined,
): OnlineCourseLiveTiming | null {
  const startTime = runner.stage.start_time
  return startTime ? { bestSeconds: bestSeconds ?? null, startTime } : null
}

/**
 * Builds the leg that ends at a node.
 *
 * @param endNode Node the leg ends at.
 * @param isInProgress Whether the runner is on this leg right now.
 * @returns A leg that is reached when its end node is, in progress when the runner is on it and
 * pending otherwise.
 */
function buildLeg(endNode: OnlineCourseNode, isInProgress: boolean): OnlineCourseLeg {
  if (endNode.progress === ONLINE_COURSE_PROGRESS.Reached) return { progress: endNode.progress }
  if (isInProgress) return { progress: ONLINE_COURSE_PROGRESS.InProgress }
  return { progress: ONLINE_COURSE_PROGRESS.Pending }
}

/**
 * Builds the course drawn for a runner: the start, one node per online control and the finish,
 * joined by legs, each with the progress of the runner.
 *
 * @param runner Runner the course is drawn for.
 * @param bestCumulativeSeconds Best time at every online split of the class, or `null` when there
 * is no class to compare with, as in club view.
 * @param hasStarted Whether the start time of the runner has passed.
 * @returns The nodes and the legs of the course.
 */
export default function buildOnlineCourse(
  runner: ProcessedRunnerModel,
  bestCumulativeSeconds: ReadonlyArray<number | null> | null,
  hasStarted: boolean,
): OnlineCourse {
  const splits = runner.stage.online_splits ?? []
  const finishSplitIndex = splits.length - 1
  const furthestSplitIndex = furthestReachedSplitIndex(runner, splits)
  const hasReachedAnySplit = furthestSplitIndex > NO_SPLIT_REACHED_INDEX
  const hasLeftTheStart = hasStarted && !runnerService.isDNS(runner)
  const isStartReached = hasReachedAnySplit || hasLeftTheStart
  const isRunning = isStartReached && isStillRunning(runner)
  const nextSplitIndex = furthestSplitIndex + 1

  const splitNodes = splits.map(
    (split, splitIndex): OnlineCourseNode => ({
      behindSeconds: behindSeconds(split.cumulative_time, bestCumulativeSeconds?.[splitIndex]),
      cumulativeSeconds: split.cumulative_time,
      kind:
        splitIndex === finishSplitIndex
          ? ONLINE_COURSE_NODE_KIND.Finish
          : ONLINE_COURSE_NODE_KIND.Control,
      label: split.control?.station ?? null,
      liveTiming:
        isRunning && splitIndex === nextSplitIndex
          ? buildLiveTiming(runner, bestCumulativeSeconds?.[splitIndex])
          : null,
      progress: nodeProgress(splitIndex <= furthestSplitIndex),
    }),
  )
  const nodes = [buildStartNode(isStartReached), ...splitNodes]

  const furthestNodeIndex = hasReachedAnySplit
    ? furthestSplitIndex + START_NODE_COUNT
    : START_NODE_INDEX
  const legs = nodes
    .slice(START_NODE_COUNT)
    .map((endNode, legIndex) => buildLeg(endNode, isRunning && legIndex === furthestNodeIndex))

  return { legs, nodes }
}
