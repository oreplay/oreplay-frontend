import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getRunnersInStage } from "../../../../../services/EventService.ts"
import { orderedRunners } from "../../../../../shared/functions.ts"
import { processRunnerData } from "../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"

export async function getTotalsByClass(
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
  return processRunnerData(runnersList)
}
