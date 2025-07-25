import {
  ParticipantModel,
  SplitModel,
  StageClassModel,
} from "../../../../../../shared/EntityTypes.ts"
import {
  ProcessedRunnerResultModel,
  ProcessedSplitModel,
} from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { DateTime } from "luxon"
import { getOnlineSplits } from "../../pages/FootO/pages/Splits/components/FootOSplitsTable/shared/footOSplitsTablefunctions.ts"

/**
 * This in an auxiliary function add the required attributes to be ProcessedSplitModel
 * with null values.
 * @param split Split to be processed
 */
export function createProcessedSplitFields(split: SplitModel): ProcessedSplitModel {
  return {
    ...split,
    time: null,
    time_behind: null,
    position: null,
    cumulative_time: null,
    cumulative_behind: null,
    cumulative_position: null,
  }
}

/**
 * This function fills the time and cumulative time of splits. Also, add a split for the finish line
 *
 * Splits are assumed to be ordered by order_number (and thus, punching time)
 * @param split_list
 * @param start_time
 * @param finish_time
 * @param participantId
 * @param time_seconds Final time to be displayed in the finish line cumulative time
 */
export function computeSplitListTimes(
  split_list: ProcessedSplitModel[],
  start_time: DateTime | null,
  finish_time: string | null,
  participantId: string,
  time_seconds: number,
): ProcessedSplitModel[] {
  const parsed_finish_time = finish_time ? DateTime.fromISO(finish_time) : null

  // Process regular splits
  const processed_split_list = split_list.map((split, index, array): ProcessedSplitModel => {
    if (start_time && split.reading_time) {
      const reading_time = DateTime.fromISO(split.reading_time)
      split.cumulative_time = reading_time.diff(start_time).as("seconds")

      // first split
      if (index == 0) {
        split.time = split.cumulative_time
        // second to last-1 splits
      } else {
        const prev_reading_time_string = array[index - 1].reading_time
        if (prev_reading_time_string) {
          split.time = reading_time.diff(DateTime.fromISO(prev_reading_time_string)).as("seconds")
        }
      }
    }
    return split
  })

  // Add finish control
  if (split_list.length > 0 && start_time) {
    // @ts-expect-error linter doesn't know that the length of splits is at least 1
    const prev_reading_time_string = split_list.at(-1).reading_time

    processed_split_list.push({
      id: `${participantId}-finishSplit`,
      reading_time: finish_time,
      order_number: Infinity,
      points: 0,
      time:
        prev_reading_time_string && parsed_finish_time
          ? parsed_finish_time.diff(DateTime.fromISO(prev_reading_time_string)).as("seconds")
          : null, // Time in seconds for this split
      time_behind: null, // Time behind best runner in seconds for this split
      position: null, // Position in this split
      cumulative_time: prev_reading_time_string && parsed_finish_time ? time_seconds : null, // Time in seconds since start
      cumulative_behind: null, // Time in seconds behind the best runner
      cumulative_position: null, // Position from start
      control: null, // No control at finish line
      is_intermediate: true, // Finish is always an online control
    })
  }

  // return
  return processed_split_list
}

/**
 * Auxiliary function to sort split
 * @param a first split to compare
 * @param b second split to compare
 */
function sorterSplitByOrderNumber(
  a: ProcessedSplitModel | SplitModel,
  b: ProcessedSplitModel | SplitModel,
): number {
  if (a.order_number && b.order_number) {
    return a.order_number - b.order_number
  } else if (!a.order_number && !b.order_number) {
    return 0
  } else if (a.order_number) {
    return 1
  } else {
    return -1
  }
}

type FieldsToReplace = {
  stage: ProcessedRunnerResultModel
}

type ReplaceParticipantFields<T extends ParticipantModel> = Omit<T, keyof FieldsToReplace> &
  FieldsToReplace

export function processParticipant<T extends ParticipantModel>(
  participant: T,
  classesList?: StageClassModel[],
): ReplaceParticipantFields<T> {
  const stage = participant.stage

  if (stage) {
    // Process splits
    //// create fields
    let processed_splits_list = stage.splits.map(createProcessedSplitFields)
    processed_splits_list.sort(sorterSplitByOrderNumber)

    //// compute times
    const start_time = stage.start_time ? DateTime.fromISO(stage.start_time) : null
    processed_splits_list = computeSplitListTimes(
      processed_splits_list,
      start_time,
      stage.finish_time,
      participant.id,
      stage.time_seconds,
    )

    // Extract online splits
    const participantStageClass =
      participant.class && classesList
        ? classesList.find((cls) => cls.id === participant.class?.id)
        : null

    const onlineControlList = participantStageClass ? participantStageClass.splits : null

    const online_splits = onlineControlList
      ? getOnlineSplits(processed_splits_list, onlineControlList, stage.start_time)
      : []

    // Return
    const processed_stage = {
      ...stage,
      splits: processed_splits_list,
      online_splits: online_splits,
    }
    return {
      ...participant,
      stage: processed_stage,
    } as ReplaceParticipantFields<T>
  } else {
    // @ts-expect-error TS2352 Temporally set Participant as non nullable
    return participant as ReplaceParticipantFields<T>
  }
}
