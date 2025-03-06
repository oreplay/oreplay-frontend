import { ControlModel, RunnerModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

type CourseControlModel = {
  control: ControlModel | null
  order_number: bigint | number | null // TODO: It can't be null
}

export function getCourseFromRunner(
  runnerList: RunnerModel[] | ProcessedRunnerModel[],
): CourseControlModel[] {
  let courseControlList: CourseControlModel[] = []

  for (let i = 0; i < runnerList.length; i++) {
    const splitList = runnerList[i].overall.splits

    if (splitList) {
      try {
        const splitsCopy = [...splitList]
        courseControlList = splitsCopy
          .map((split): CourseControlModel => {
            return {
              control: split.control,
              order_number: split.order_number,
            }
          })
          .filter((control) => control.order_number != null)

        break
      } catch (e) {
        console.error(e)
      }
    }
  }
  return courseControlList
}
