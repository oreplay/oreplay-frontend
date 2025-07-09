import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getRunnersInStage } from "../../../../../services/EventService.ts"
import { sortRunners } from "../../../../../shared/sortingFunctions/sortRunners.ts"
import { processRunnerData } from "../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"

export async function getRelayRunnersByClass(
  eventId: string,
  stageId: string,
  classId: string,
): Promise<ProcessedRunnerModel[]> {
  // Make query
  const runnersPage = await getRunnersInStage(eventId, stageId, classId)
  let runnersList = runnersPage.data

  // Order
  runnersList = sortRunners(runnersList)

  // Runner processing
  return processRunnerData(runnersList)
}
