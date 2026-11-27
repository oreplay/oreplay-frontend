import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getRunnersInStage } from "../../../../../services/EventService.ts"
import { sortRunners } from "../../../../../shared/sortingFunctions/sortRunners.ts"
import { processRunnerData } from "../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"
import { withMockupRadioControls } from "../shared/mockupRadioControls.ts"
import { sortRelayRunners } from "../shared/sortRelayRunners.ts"

export async function getRelayRunnersByClass(
  eventId: string,
  stageId: string,
  classId: string,
): Promise<ProcessedRunnerModel[]> {
  // Make query
  const runnersPage = await getRunnersInStage(eventId, stageId, classId)
  const { classes, teams } = withMockupRadioControls(runnersPage.data)

  // Sort
  const runnersList = sortRunners(teams)

  // Runner processing
  const processRunners = processRunnerData(runnersList, classes)

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
  const { classes, teams } = withMockupRadioControls(runnersPage.data)

  // Sort
  const runnersList = sortRunners(teams)

  // Runner processing
  const processRunners = processRunnerData(runnersList, classes)

  // Final sort
  return sortRelayRunners(processRunners)
}
