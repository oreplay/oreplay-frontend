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
  OnlineCourseNode,
  OnlineCourseNodeProgress,
} from "./onlineCourse.ts"

const NO_SPLIT_REACHED_INDEX = -1
const START_NODE_INDEX = 0
const START_NODE_COUNT = 1

function hasReading(split: RadioSplitModel) {
  return split.cumulative_time !== null
}

function hasFinishedClassified(runner: ProcessedRunnerModel) {
  const isClassifiedStatus = runnerService.isOK(runner) || runnerService.isNC(runner)
  return runnerService.hasFinished(runner) && isClassifiedStatus
}

function isStillRunning(runner: ProcessedRunnerModel) {
  return !runnerService.hasFinished(runner) && runnerService.isOK(runner)
}

function furthestReachedSplitIndex(runner: ProcessedRunnerModel, splits: RadioSplitModel[]) {
  const finishSplitIndex = splits.length - 1
  if (hasFinishedClassified(runner)) return finishSplitIndex
  return splits.map(hasReading).lastIndexOf(true)
}

function nodeProgress(isReached: boolean): OnlineCourseNodeProgress {
  return isReached ? ONLINE_COURSE_PROGRESS.Reached : ONLINE_COURSE_PROGRESS.Pending
}

function behindSeconds(cumulativeSeconds: number | null, bestSeconds: number | null | undefined) {
  if (cumulativeSeconds === null || bestSeconds === null || bestSeconds === undefined) return null
  return cumulativeSeconds - bestSeconds
}

function buildStartNode(isReached: boolean): OnlineCourseNode {
  return {
    behindSeconds: null,
    cumulativeSeconds: null,
    kind: ONLINE_COURSE_NODE_KIND.Start,
    label: null,
    progress: nodeProgress(isReached),
  }
}

function buildLeg(endNode: OnlineCourseNode, isInProgress: boolean): OnlineCourseLeg {
  if (endNode.progress === ONLINE_COURSE_PROGRESS.Reached) return { progress: endNode.progress }
  if (isInProgress) return { progress: ONLINE_COURSE_PROGRESS.InProgress }
  return { progress: ONLINE_COURSE_PROGRESS.Pending }
}

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

  const splitNodes = splits.map(
    (split, splitIndex): OnlineCourseNode => ({
      behindSeconds: behindSeconds(split.cumulative_time, bestCumulativeSeconds?.[splitIndex]),
      cumulativeSeconds: split.cumulative_time,
      kind:
        splitIndex === finishSplitIndex
          ? ONLINE_COURSE_NODE_KIND.Finish
          : ONLINE_COURSE_NODE_KIND.Control,
      label: split.control?.station ?? null,
      progress: nodeProgress(splitIndex <= furthestSplitIndex),
    }),
  )
  const nodes = [buildStartNode(isStartReached), ...splitNodes]

  const furthestNodeIndex = hasReachedAnySplit
    ? furthestSplitIndex + START_NODE_COUNT
    : START_NODE_INDEX
  const isRunning = isStartReached && isStillRunning(runner)
  const legs = nodes
    .slice(START_NODE_COUNT)
    .map((endNode, legIndex) => buildLeg(endNode, isRunning && legIndex === furthestNodeIndex))

  return { legs, nodes }
}
