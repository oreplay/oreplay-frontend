import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getRunnersInStage } from "../../../../../services/EventService.ts"
import { sortRunners } from "../../../../../shared/sortingFunctions/sortRunners.ts"
import {
  calculatePositionsAndBehindsFootO,
  processRunnerData,
} from "../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"
import { StageClassModel } from "../../../../../../../shared/EntityTypes.ts"
import { sortFootORunners } from "../shared/functions.ts"

/**
 * Query and process (compute splits) of runners by classes
 *
 * This function is just a wrapper of other function that make each step of the
 * query and process pipeline to give specific processing for each orienteering
 * discipline.
 * @param eventId
 * @param stageId
 * @param classId
 * @param classesList A list of classes that contains the online splits for that class
 */
export async function getFootORunnersByClass(
  eventId: string,
  stageId: string,
  classId: string,
  classesList?: StageClassModel[],
): Promise<ProcessedRunnerModel[]> {
  // Make query
  const runnersPage = await getRunnersInStage(eventId, stageId, classId)
  const runnersList = runnersPage.data

  // Runner processing
  let processedRunnersList = processRunnerData(runnersList, classesList)
  processedRunnersList = calculatePositionsAndBehindsFootO(processedRunnersList)

  // return
  return sortFootORunners(processedRunnersList)
}

export async function getFootORunnersByClub(
  eventId: string,
  stageId: string,
  clubId: string,
  classesList?: StageClassModel[],
): Promise<ProcessedRunnerModel[]> {
  const runnersPage = await getRunnersInStage(eventId, stageId, undefined, clubId)
  let runnersList = runnersPage.data

  // Order
  runnersList = sortRunners(runnersList)

  // Processing
  return processRunnerData(runnersList, classesList)
}
