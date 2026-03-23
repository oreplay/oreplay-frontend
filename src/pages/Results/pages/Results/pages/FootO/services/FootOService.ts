import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getRunnersInStage } from "../../../../../services/EventService.ts"
import { sortRunners } from "../../../../../shared/sortingFunctions/sortRunners.ts"
import {
  calculatePositionsAndBehindsFootO,
  processRunnerData,
} from "../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"
import { RunnerModel, StageClassModel } from "../../../../../../../shared/EntityTypes.ts"
import { getCourseFromRunner } from "../pages/Splits/components/FootOSplitsTable/shared/footOSplitsTablefunctions.ts"
import { captureException as sentryCaptureException } from "@sentry/react"

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
  const runnersList = sortRunners(runnersPage.data)

  // TODO: WORKAROUND for bug in backed: online controls list is not sorted
  // Use the download from any runner to get the real order of the online splits
  wrongOnlineSplitsOrderWorkaround(classId, runnersList, classesList)

  // Runner processing
  const processedRunnersList = processRunnerData(runnersList, classesList)

  // return
  return calculatePositionsAndBehindsFootO(processedRunnersList)
}

export async function getFootORunnersByClub(
  eventId: string,
  stageId: string,
  clubId: string,
  classesList?: StageClassModel[],
): Promise<ProcessedRunnerModel[]> {
  const runnersPage = await getRunnersInStage(eventId, stageId, undefined, clubId)
  let runnersList = runnersPage.data

  // Sort
  runnersList = sortRunners(runnersList)

  // Processing
  return processRunnerData(runnersList, classesList)
}

/**
 * Helper class to try fixing online splits order according to chip readings
 * @param classId id of the class we are querying
 * @param runnersList list of runners to read course from
 * @param classesList list of classes we want to update
 */
function wrongOnlineSplitsOrderWorkaround(
  classId: string,
  runnersList: RunnerModel[],
  classesList?: StageClassModel[],
) {
  try {
    if (classesList && classesList.length > 0) {
      // Find class within provided classesList
      const thisClass = classesList.find((cls) => cls.id === classId)
      if (thisClass && thisClass.splits.length > 0) {
        // Get course to update runner list
        const course = getCourseFromRunner(runnersList)
        if (course.length > 0) {
          const onlineControlNumbers = thisClass.splits.map((control) => control.station)

          // Find controls that are online controls and pick their order
          const filteredCourse = course.filter(
            (control) => control.control && onlineControlNumbers.includes(control.control.station),
          )
          const sortedOnlineControls = filteredCourse.map((control) => {
            const match = thisClass.splits.find(
              (onlineControl) => onlineControl.station === control.control?.station,
            )

            if (!match) {
              throw new Error(
                "Algorithm to update online splits based on chip reading produced undefined splits",
              )
            }

            return match
          })

          // Final check
          if (sortedOnlineControls.length != thisClass.splits.length) {
            throw new Error(
              "Algorithm to update online splits based on chip reading failed to produce the same number of splits",
            )
          }

          // Update online controls
          console.debug("Online controls order updated through chip readings")
          thisClass.splits = sortedOnlineControls
        }
      } else {
        console.debug("Online controls order not updated because no chip readings were founds")
      }
    }
  } catch (error) {
    console.error(error)
    sentryCaptureException(error)
  }
}
