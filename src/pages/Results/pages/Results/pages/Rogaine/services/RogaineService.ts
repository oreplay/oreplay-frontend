import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getRunnersInStage } from "../../../../../services/EventService.ts"
import { orderedRunners } from "../../../../../shared/functions.ts"
import { processRunnerData } from "../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"
import { getUniqueStationNumbers } from "../shared/Functions.ts"

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
export async function getRoganineRunnersByClass(
  eventId: string,
  stageId: string,
  classId: string,
): Promise<[ProcessedRunnerModel[], bigint[]]> {
  // Make query
  const runnersPage = await getRunnersInStage(eventId, stageId, classId)
  let runnersList = runnersPage.data

  // Process runners
  runnersList = orderedRunners(runnersList)
  const processedRunnersList = processRunnerData(runnersList)

  // Compute controls
  const controls = getUniqueStationNumbers(processedRunnersList)

  // return
  return [processedRunnersList, controls]
}
