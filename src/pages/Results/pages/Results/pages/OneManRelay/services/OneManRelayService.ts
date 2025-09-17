import { StageClassModel } from "../../../../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { sortRunners } from "../../../../../shared/sortingFunctions/sortRunners.ts"
import { processRunnerData } from "../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"
import { getRunnersInStage } from "../../../../../services/EventService.ts"

export async function getOneManRelayRunnersByClass(
  eventId: string,
  stageId: string,
  classId: string,
  classesList?: StageClassModel[],
): Promise<ProcessedRunnerModel[]> {
  // Make query
  const runnersPage = await getRunnersInStage(eventId, stageId, classId)
  const runnersList = sortRunners(runnersPage.data)

  // return
  return processRunnerData(runnersList, classesList)
}

export async function getOneManRelayRunnersByClub(
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
