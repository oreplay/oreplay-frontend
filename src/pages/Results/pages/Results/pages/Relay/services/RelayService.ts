import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getRunnersInStage } from "../../../../../services/EventService.ts"
import { sortRunners } from "../../../../../shared/sortingFunctions/sortRunners.ts"
import { processRunnerData } from "../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"
import { sortRelayRunners } from "../shared/sortRelayRunners.ts"

export async function getRelayRunnersByClass(
  eventId: string,
  stageId: string,
  classId: string,
): Promise<ProcessedRunnerModel[]> {
  // Make query
  const runnersPage = await getRunnersInStage(eventId, stageId, classId)
  let runnersList = runnersPage.data

  // Sort
  runnersList = sortRunners(runnersList)

  // Runner processing
  const processRunners = processRunnerData(runnersList)

  // Final sort
  return sortRelayRunners(processRunners)
}

export async function getRelayRunnersByClub(
  eventId: string,
  stageId: string,
  clubId: string,
): Promise<ProcessedRunnerModel[]> {
  // Make query
  const runnersPage = await getRunnersInStage(eventId, stageId, undefined, clubId)
  let runnersList = runnersPage.data

  // Sort
  runnersList = sortRunners(runnersList)

  // Runner processing
  const processRunners = processRunnerData(runnersList)

  // Final sort
  return sortRelayRunners(processRunners)
}
