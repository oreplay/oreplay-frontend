import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getRunnersInStage } from "../../../../../services/EventService.ts"
import { orderedRunners } from "../../../../../shared/functions.ts"
import {
  calculatePositionsAndBehindsFootO,
  processRunnerData,
} from "../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"

/**
 * Query and process (compute splits) of runners by classes
 *
 * This function is just a wrapper of other function that make each step of the
 * query and process pipeline to give specific processing for each orienteering
 * discipline.
 * @param eventId
 * @param stageId
 * @param classId
 */
export async function getFootORunnersByClass(
  eventId: string,
  stageId: string,
  classId: string,
): Promise<ProcessedRunnerModel[]> {
  // Make query
  const runnersPage = await getRunnersInStage(eventId, stageId, classId)
  let runnersList = runnersPage.data

  // Order
  runnersList = orderedRunners(runnersList)

  // Runner processing
  let processedRunnersList = processRunnerData(runnersList)
  processedRunnersList = calculatePositionsAndBehindsFootO(processedRunnersList)

  // return
  return processedRunnersList
}

export async function getFootORunnersByClub(
  eventId: string,
  stageId: string,
  clubId: string,
): Promise<ProcessedRunnerModel[]> {
  const runnersPage = await getRunnersInStage(eventId, stageId, undefined, clubId)
  let runnersList = runnersPage.data

  // Order
  runnersList = orderedRunners(runnersList)

  // Processing
  return processRunnerData(runnersList)
}
