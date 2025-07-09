import { describe, it, expect } from "vitest"
import {
  OnlineControlModel,
  ParticipantModel,
  RunnerModel,
  SplitModel,
  StageClassModel,
} from "../../../../../../shared/EntityTypes.ts"
import {
  ProcessedParticipantModel,
  ProcessedRunnerModel,
  ProcessedSplitModel,
} from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  computeSplitListTimes,
  createProcessedSplitFields,
  processParticipant,
} from "./runnerProccesing.ts"
import { DateTime } from "luxon"
import { processRunnerData } from "../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"

describe("createProcessedSplitFields", () => {
  it("should add the right fields", () => {
    const split: SplitModel = {
      id: "string",
      is_intermediate: false,
      reading_time: "2001-01-01T09:41:37.000+00:00",
      points: 0,
      order_number: 11,
      control: {
        id: "string",
        station: "36",
        control_type: {
          id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
          description: "Normal Control",
        },
      },
    }

    const xSplit: ProcessedSplitModel = {
      id: "string",
      is_intermediate: false,
      reading_time: "2001-01-01T09:41:37.000+00:00",
      points: 0,
      order_number: 11,
      control: {
        id: "string",
        station: "36",
        control_type: {
          id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
          description: "Normal Control",
        },
      },
      time: null,
      time_behind: null,
      position: null,
      cumulative_time: null,
      cumulative_behind: null,
      cumulative_position: null,
    }

    expect(createProcessedSplitFields(split)).toEqual(xSplit)
  })
})

describe("computeSplitListTimes", () => {
  it("should compute the times for classified runner", () => {
    const split_list: ProcessedSplitModel[] = [
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:01:00.000+00:00",
        points: 0,
        order_number: 1,
        control: {
          id: "string",
          station: "31",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: null,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:03:00.000+00:00",
        points: 0,
        order_number: 2,
        control: {
          id: "string",
          station: "32",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: null,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:07:00.000+00:00",
        points: 0,
        order_number: 3,
        control: {
          id: "string",
          station: "33",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: null,
        cumulative_behind: null,
        cumulative_position: null,
      },
    ]

    const expected_split_list: ProcessedSplitModel[] = [
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:01:00.000+00:00",
        points: 0,
        order_number: 1,
        control: {
          id: "string",
          station: "31",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: 60,
        time_behind: null,
        position: null,
        cumulative_time: 60,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:03:00.000+00:00",
        points: 0,
        order_number: 2,
        control: {
          id: "string",
          station: "32",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: 120,
        time_behind: null,
        position: null,
        cumulative_time: 180,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:07:00.000+00:00",
        points: 0,
        order_number: 3,
        control: {
          id: "string",
          station: "33",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: 240,
        time_behind: null,
        position: null,
        cumulative_time: 420,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "participantId-finishSplit",
        is_intermediate: true,
        reading_time: "2025-06-27T09:15:00.000+00:00",
        points: 0,
        order_number: Infinity,
        control: null,
        time: 480,
        time_behind: null,
        position: null,
        cumulative_time: 900,
        cumulative_behind: null,
        cumulative_position: null,
      },
    ]

    const start_time = DateTime.fromISO("2025-06-27T09:00:00.000+00:00")
    const finish_time = "2025-06-27T09:15:00.000+00:00"

    const actual_split_list = computeSplitListTimes(
      split_list,
      start_time,
      finish_time,
      "participantId",
      900,
    )

    // Avoid error while checking due to different representations of the same timestamp
    const actual_compare = actual_split_list.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const expected_compare = expected_split_list.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))

    expect(actual_compare).toEqual(expected_compare)
  })

  it("should handle a runner who didn't started and has start time", () => {
    const split_list: ProcessedSplitModel[] = []
    const expected_split_list: ProcessedSplitModel[] = []

    // Actually assert
    const start_time = DateTime.fromISO("2025-06-27T09:00:00.000+00:00")
    const finish_time = null

    const actual_split_list = computeSplitListTimes(
      split_list,
      start_time,
      finish_time,
      "participantId",
      0,
    )

    expect(actual_split_list).toEqual(expected_split_list)
  })

  it("should handle a runner who didn't started and doesn't have start time", () => {
    const split_list: ProcessedSplitModel[] = []
    const expected_split_list: ProcessedSplitModel[] = []

    // Actually assert
    const start_time = null
    const finish_time = null

    const actual_split_list = computeSplitListTimes(
      split_list,
      start_time,
      finish_time,
      "participantId",
      0,
    )

    expect(actual_split_list).toEqual(expected_split_list)
  })

  it("should handle a runner with missing punch. Missing punches time should be null, and cumulative_time should be null from there", () => {
    const split_list: ProcessedSplitModel[] = [
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:01:00.000+00:00",
        points: 0,
        order_number: 1,
        control: {
          id: "string",
          station: "31",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: null,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "string",
        is_intermediate: false,
        reading_time: null,
        points: 0,
        order_number: 2,
        control: {
          id: "string",
          station: "32",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: null,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:07:00.000+00:00",
        points: 0,
        order_number: 3,
        control: {
          id: "string",
          station: "33",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: null,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:15:00.000+00:00",
        points: 0,
        order_number: 4,
        control: {
          id: "string",
          station: "34",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: null,
        cumulative_behind: null,
        cumulative_position: null,
      },
    ]

    const expected_split_list: ProcessedSplitModel[] = [
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:01:00.000+00:00",
        points: 0,
        order_number: 1,
        control: {
          id: "string",
          station: "31",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: 60,
        time_behind: null,
        position: null,
        cumulative_time: 60,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "string",
        is_intermediate: false,
        reading_time: null,
        points: 0,
        order_number: 2,
        control: {
          id: "string",
          station: "32",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: null,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:07:00.000+00:00",
        points: 0,
        order_number: 3,
        control: {
          id: "string",
          station: "33",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: 420,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:15:00.000+00:00",
        points: 0,
        order_number: 4,
        control: {
          id: "string",
          station: "34",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: 480,
        time_behind: null,
        position: null,
        cumulative_time: 900,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "participantId-finishSplit",
        is_intermediate: true,
        reading_time: "2025-06-27T09:31:00.000+00:00",
        points: 0,
        order_number: Infinity,
        control: null,
        time: 960,
        time_behind: null,
        position: null,
        cumulative_time: 1860,
        cumulative_behind: null,
        cumulative_position: null,
      },
    ]

    const start_time = DateTime.fromISO("2025-06-27T09:00:00.000+00:00")
    const finish_time = "2025-06-27T09:31:00.000+00:00"

    const actual_split_list = computeSplitListTimes(
      split_list,
      start_time,
      finish_time,
      "participantId",
      1860,
    )

    // Avoid error while checking due to different representations of the same timestamp
    const actual_compare = actual_split_list.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const expected_compare = expected_split_list.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))

    expect(actual_compare).toEqual(expected_compare)
  })

  it("should handle a runner who didn't punch the finish line", () => {
    const split_list: ProcessedSplitModel[] = [
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:01:00.000+00:00",
        points: 0,
        order_number: 1,
        control: {
          id: "string",
          station: "31",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: null,
        cumulative_behind: null,
        cumulative_position: null,
      },
    ]

    const expected_split_list: ProcessedSplitModel[] = [
      {
        id: "string",
        is_intermediate: false,
        reading_time: "2025-06-27T09:01:00.000+00:00",
        points: 0,
        order_number: 1,
        control: {
          id: "string",
          station: "31",
          control_type: {
            id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
            description: "Normal Control",
          },
        },
        time: 60,
        time_behind: null,
        position: null,
        cumulative_time: 60,
        cumulative_behind: null,
        cumulative_position: null,
      },
      {
        id: "participantId-finishSplit",
        is_intermediate: true,
        reading_time: null,
        points: 0,
        order_number: Infinity,
        control: null,
        time: null,
        time_behind: null,
        position: null,
        cumulative_time: null,
        cumulative_behind: null,
        cumulative_position: null,
      },
    ]

    const start_time = DateTime.fromISO("2025-06-27T09:00:00.000+00:00")
    const finish_time = null

    const actual_split_list = computeSplitListTimes(
      split_list,
      start_time,
      finish_time,
      "participantId",
      0,
    )

    // Avoid error while checking due to different representations of the same timestamp
    const actual_compare = actual_split_list.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const expected_compare = expected_split_list.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))

    expect(actual_compare).toEqual(expected_compare)
  })
})

describe("processParticipant", () => {
  it("should handle a typical participant with splits, and those should be ordered", () => {
    const participant: ParticipantModel = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: {
        id: "string",
        short_name: "club name",
      },
      full_name: "full name",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: "0",
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 0,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
          },
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 0,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
          },
        ],
      },
      overalls: null,
    }

    const expected_participant: ProcessedParticipantModel = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: {
        id: "string",
        short_name: "club name",
      },
      full_name: "full name",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: "0",
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 0,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 60,
            time_behind: null,
            position: null,
            cumulative_time: 60,
            cumulative_behind: null,
            cumulative_position: null,
          },
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 0,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 120,
            time_behind: null,
            position: null,
            cumulative_time: 180,
            cumulative_behind: null,
            cumulative_position: null,
          },
          {
            id: "string-finishSplit",
            is_intermediate: true,
            reading_time: "2025-06-27T09:07:00.000+00:00",
            points: 0,
            order_number: Infinity,
            control: null,
            time: 240,
            time_behind: null,
            position: null,
            cumulative_time: 420,
            cumulative_behind: null,
            cumulative_position: null,
          },
        ],
        online_splits: [],
      },
      overalls: null,
    }

    // Actually compare
    const actual_participant = processParticipant(participant)
    const compare_splits = actual_participant.stage?.splits.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const compare_participant = {
      ...actual_participant,
      stage: { ...actual_participant.stage, splits: compare_splits },
    }

    const compare_expected_splits = expected_participant.stage.splits.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const compare_expected_participant = {
      ...expected_participant,
      stage: { ...expected_participant.stage, splits: compare_expected_splits },
    }

    expect(compare_participant).toEqual(compare_expected_participant)
  })

  it("should handle a typical ranking participant (as of now do nothing)", () => {
    const participant: ParticipantModel = {
      id: "751842bc-441b-4958-8f4b-cbee82e24e1e",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      leg_number: 1,
      class: {
        id: "string",
        short_name: "Class",
        long_name: "Class long",
      },
      club: {
        id: "string",
        short_name: "Club",
      },
      full_name: "Full name",
      // @ts-expect-error TS2322 Temporally set Participant.stage to non nullable  //TODO: Correct the entity types
      stage: null,
      overalls: {
        parts: [
          {
            id: "string",
            stage_order: 1,
            upload_type: "total_times",
            stage: null,
            position: 1,
            time_seconds: 1877,
            points_final: 0,
            note: null,
          },
          {
            id: "string",
            stage_order: 2,
            upload_type: "total_times",
            stage: null,
            position: 0,
            time_seconds: 837,
            points_final: 0,
            note: null,
          },
          {
            id: "string",
            stage_order: 3,
            upload_type: "total_times",
            stage: null,
            position: 2,
            time_seconds: 4996,
            points_final: 0,
            note: null,
          },
        ],
        overall: {
          id: "string",
          stage_order: 1,
          upload_type: "total_times",
          stage: null,
          position: 1,
          time_seconds: 6873,
          points_final: 0,
          note: null,
        },
      },
    }

    expect(processParticipant(participant)).toEqual(participant)
  })

  it("should extract online splits when there are only those in splits", () => {
    const participant: ParticipantModel = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "classId",
        short_name: "short name",
        long_name: "long name",
      },
      club: {
        id: "string",
        short_name: "club name",
      },
      full_name: "full name",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: null,
        upload_type: "res_intermediates",
        time_seconds: 0,
        position: 0,
        status_code: "0",
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 0,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
          },
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 0,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
          },
        ],
      },
      overalls: null,
    }

    const expected_participant: ProcessedParticipantModel = {
      ...participant,
      stage: {
        ...participant.stage,
        splits: [
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 0,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 60,
            time_behind: null,
            position: null,
            cumulative_time: 60,
            cumulative_behind: null,
            cumulative_position: null,
          },
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 0,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 120,
            time_behind: null,
            position: null,
            cumulative_time: 180,
            cumulative_behind: null,
            cumulative_position: null,
          },
          {
            control: null,
            cumulative_behind: null,
            cumulative_position: null,
            cumulative_time: null,
            id: "string-finishSplit",
            is_intermediate: true,
            order_number: Infinity,
            points: 0,
            position: null,
            reading_time: null,
            time: null,
            time_behind: null,
          },
        ],
        online_splits: [
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 0,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 60,
            time_behind: null,
            position: null,
            cumulative_time: 60,
            cumulative_behind: null,
            cumulative_position: null,
            is_next: null,
          },
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 0,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 120,
            time_behind: null,
            position: null,
            cumulative_time: 180,
            cumulative_behind: null,
            cumulative_position: null,
            is_next: null,
          },
          {
            control: null,
            cumulative_behind: null,
            cumulative_position: null,
            cumulative_time: null,
            id: "string-finishSplit",
            is_intermediate: true,
            is_next: DateTime.fromISO("2025-06-27T11:03:00.000+02:00"),
            order_number: Infinity,
            points: 0,
            position: null,
            reading_time: null,
            time: null,
            time_behind: null,
          },
        ],
      },
      overalls: null,
    }

    const onlineControls: OnlineControlModel[] = [
      {
        id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
        station: "32",
      },
      {
        id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
        station: "31",
      },
    ]

    const classesList: StageClassModel[] = [
      {
        id: "classId",
        short_name: "short_name",
        long_name: "long_name",
        splits: onlineControls,
      },
    ]

    // Actually compare
    const actual_participant = processParticipant(participant, classesList)
    const compare_splits = actual_participant.stage?.splits.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const compare_participant = {
      ...actual_participant,
      stage: { ...actual_participant.stage, splits: compare_splits },
    }

    const compare_expected_splits = expected_participant.stage.splits.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const compare_expected_participant = {
      ...expected_participant,
      stage: { ...expected_participant.stage, splits: compare_expected_splits },
    }

    expect(compare_participant).toEqual(compare_expected_participant)
  })

  it("should extract online splits when the runners has downloaded", () => {
    const participant: ParticipantModel = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: {
        id: "string",
        short_name: "club name",
      },
      full_name: "full name",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_intermediates",
        time_seconds: 420,
        position: 2,
        status_code: "0",
        time_behind: 35,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 0,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
          },
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 0,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
          },
        ],
      },
      overalls: null,
    }

    const expected_participant: ProcessedParticipantModel = {
      ...participant,
      stage: {
        ...participant.stage,
        splits: [
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 0,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 60,
            time_behind: null,
            position: null,
            cumulative_time: 60,
            cumulative_behind: null,
            cumulative_position: null,
          },
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 0,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 120,
            time_behind: null,
            position: null,
            cumulative_time: 180,
            cumulative_behind: null,
            cumulative_position: null,
          },
          {
            control: null,
            cumulative_behind: null,
            cumulative_position: null,
            cumulative_time: 420,
            id: "string-finishSplit",
            is_intermediate: true,
            order_number: Infinity,
            points: 0,
            position: null,
            reading_time: "2025-06-27T09:07:00.000+00:00",
            time: 240,
            time_behind: null,
          },
        ],
        online_splits: [
          {
            id: "string",
            is_intermediate: true,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 0,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 60,
            time_behind: null,
            position: null,
            cumulative_time: 60,
            cumulative_behind: null,
            cumulative_position: null,
            is_next: null,
          },
          {
            control: null,
            cumulative_behind: null,
            cumulative_position: null,
            cumulative_time: 420,
            id: "string-finishSplit",
            is_intermediate: true,
            is_next: null,
            order_number: Infinity,
            points: 0,
            position: null,
            reading_time: "2025-06-27T09:07:00.000+00:00",
            time: 240,
            time_behind: null,
          },
        ],
      },
      overalls: null,
    }

    const onlineControls: OnlineControlModel[] = [
      {
        id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
        station: "31",
      },
    ]

    const classesList: StageClassModel[] = [
      {
        id: "classId",
        short_name: "short_name",
        long_name: "long_name",
        splits: onlineControls,
      },
    ]

    // Actually compare
    const actual_participant = processParticipant(participant, classesList)
    const compare_splits = actual_participant.stage?.splits.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const compare_participant = {
      ...actual_participant,
      stage: { ...actual_participant.stage, splits: compare_splits },
    }

    const compare_expected_splits = expected_participant.stage.splits.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const compare_expected_participant = {
      ...expected_participant,
      stage: { ...expected_participant.stage, splits: compare_expected_splits },
    }

    expect(compare_participant).toEqual(compare_expected_participant)
  })
})

describe("processRunnerData", () => {
  it("should handle a typical foot-o single runner", () => {
    const runner: RunnerModel = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: {
        id: "string",
        short_name: "club name",
      },
      full_name: "full name",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: "0",
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 0,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
          },
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 0,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
          },
        ],
      },
      overalls: null,
    }

    const expected_runner: ProcessedRunnerModel = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: {
        id: "string",
        short_name: "club name",
      },
      full_name: "full name",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: "0",
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 0,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 60,
            time_behind: null,
            position: null,
            cumulative_time: 60,
            cumulative_behind: null,
            cumulative_position: null,
          },
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 0,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 120,
            time_behind: null,
            position: null,
            cumulative_time: 180,
            cumulative_behind: null,
            cumulative_position: null,
          },
          {
            id: "string-finishSplit",
            is_intermediate: true,
            reading_time: "2025-06-27T09:07:00.000+00:00",
            points: 0,
            order_number: Infinity,
            control: null,
            time: 240,
            time_behind: null,
            position: null,
            cumulative_time: 420,
            cumulative_behind: null,
            cumulative_position: null,
          },
        ],
        online_splits: [],
      },
      overalls: null,
    }

    // Actually compare
    const actual_runner = processRunnerData([runner])[0]
    const compare_splits = actual_runner.stage.splits.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const compare_runner = {
      ...actual_runner,
      stage: { ...actual_runner.stage, splits: compare_splits },
    }

    const compare_expected_splits = expected_runner.stage.splits.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const compare_expected_runner = {
      ...expected_runner,
      stage: { ...expected_runner.stage, splits: compare_expected_splits },
    }

    expect(compare_runner).toEqual(compare_expected_runner)
  })

  it("should handle a typical rogaine single runner", () => {
    const runner: RunnerModel = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: {
        id: "string",
        short_name: "club name",
      },
      full_name: "full name",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: "0",
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 15,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 10,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
          },
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 5,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
          },
        ],
      },
      overalls: null,
    }

    const expected_runner: ProcessedRunnerModel = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: {
        id: "string",
        short_name: "club name",
      },
      full_name: "full name",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: "0",
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 15,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:01:00.000+00:00",
            points: 5,
            order_number: 1,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 60,
            time_behind: null,
            position: null,
            cumulative_time: 60,
            cumulative_behind: null,
            cumulative_position: null,
          },
          {
            id: "string",
            is_intermediate: false,
            reading_time: "2025-06-27T09:03:00.000+00:00",
            points: 10,
            order_number: 2,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                description: "Normal Control",
              },
            },
            time: 120,
            time_behind: null,
            position: null,
            cumulative_time: 180,
            cumulative_behind: null,
            cumulative_position: null,
          },
          {
            id: "string-finishSplit",
            is_intermediate: true,
            reading_time: "2025-06-27T09:07:00.000+00:00",
            points: 0,
            order_number: Infinity,
            control: null,
            time: 240,
            time_behind: null,
            position: null,
            cumulative_time: 420,
            cumulative_behind: null,
            cumulative_position: null,
          },
        ],
        online_splits: [],
      },
      overalls: null,
    }

    // Actually compare
    const actual_runner = processRunnerData([runner])[0]
    const compare_splits = actual_runner.stage.splits.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const compare_runner = {
      ...actual_runner,
      stage: { ...actual_runner.stage, splits: compare_splits },
    }

    const compare_expected_splits = expected_runner.stage.splits.map((split) => ({
      ...split,
      reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
    }))
    const compare_expected_runner = {
      ...expected_runner,
      stage: { ...expected_runner.stage, splits: compare_expected_splits },
    }

    expect(compare_runner).toEqual(compare_expected_runner)
  })

  it("should handle a typical relay team runner", () => {
    const runner: RunnerModel = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: null,
      full_name: "full name team",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: "0",
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [],
      },
      overalls: null,
      runners: [
        {
          id: "string",
          bib_number: "1234",
          is_nc: false,
          eligibility: null,
          sicard: "12345678",
          sex: "M",
          class: null,
          club: null,
          full_name: "full name 2",
          leg_number: 2,
          stage: {
            id: "string",
            result_type_id: "string",
            start_time: "2025-06-27T09:00:00.000+00:00",
            finish_time: "2025-06-27T09:07:00.000+00:00",
            upload_type: "res_splits",
            time_seconds: 420,
            position: 0,
            status_code: "0",
            time_behind: 0,
            time_neutralization: 0,
            time_adjusted: 0,
            time_penalty: 0,
            time_bonus: 0,
            points_final: 0,
            points_adjusted: 0,
            points_penalty: 0,
            points_bonus: 0,
            splits: [
              {
                id: "string",
                is_intermediate: false,
                reading_time: "2025-06-27T09:03:00.000+00:00",
                points: 0,
                order_number: 2,
                control: {
                  id: "string",
                  station: "32",
                  control_type: {
                    id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                    description: "Normal Control",
                  },
                },
              },
              {
                id: "string",
                is_intermediate: false,
                reading_time: "2025-06-27T09:01:00.000+00:00",
                points: 0,
                order_number: 1,
                control: {
                  id: "string",
                  station: "31",
                  control_type: {
                    id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                    description: "Normal Control",
                  },
                },
              },
            ],
          },
          overalls: null,
        },
        {
          id: "string",
          bib_number: "1234",
          is_nc: false,
          eligibility: null,
          sicard: "12345678",
          sex: "M",
          class: null,
          club: null,
          full_name: "full name 1",
          leg_number: 1,
          stage: {
            id: "string",
            result_type_id: "string",
            start_time: "2025-06-27T09:00:00.000+00:00",
            finish_time: "2025-06-27T09:07:00.000+00:00",
            upload_type: "res_splits",
            time_seconds: 420,
            position: 0,
            status_code: "0",
            time_behind: 0,
            time_neutralization: 0,
            time_adjusted: 0,
            time_penalty: 0,
            time_bonus: 0,
            points_final: 0,
            points_adjusted: 0,
            points_penalty: 0,
            points_bonus: 0,
            splits: [
              {
                id: "string",
                is_intermediate: false,
                reading_time: "2025-06-27T09:03:00.000+00:00",
                points: 0,
                order_number: 2,
                control: {
                  id: "string",
                  station: "32",
                  control_type: {
                    id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                    description: "Normal Control",
                  },
                },
              },
              {
                id: "string",
                is_intermediate: false,
                reading_time: "2025-06-27T09:01:00.000+00:00",
                points: 0,
                order_number: 1,
                control: {
                  id: "string",
                  station: "31",
                  control_type: {
                    id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                    description: "Normal Control",
                  },
                },
              },
            ],
          },
          overalls: null,
        },
      ],
    }

    const expected_runner: ProcessedRunnerModel = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: null,
      full_name: "full name team",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: "0",
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [],
        online_splits: [],
      },
      overalls: null,
      runners: [
        {
          id: "string",
          bib_number: "1234",
          is_nc: false,
          eligibility: null,
          sicard: "12345678",
          sex: "M",
          class: null,
          club: null,
          full_name: "full name 1",
          leg_number: 1,
          stage: {
            id: "string",
            result_type_id: "string",
            start_time: "2025-06-27T09:00:00.000+00:00",
            finish_time: "2025-06-27T09:07:00.000+00:00",
            upload_type: "res_splits",
            time_seconds: 420,
            position: 0,
            status_code: "0",
            time_behind: 0,
            time_neutralization: 0,
            time_adjusted: 0,
            time_penalty: 0,
            time_bonus: 0,
            points_final: 0,
            points_adjusted: 0,
            points_penalty: 0,
            points_bonus: 0,
            splits: [
              {
                id: "string",
                is_intermediate: false,
                reading_time: "2025-06-27T09:01:00.000+00:00",
                points: 0,
                order_number: 1,
                control: {
                  id: "string",
                  station: "31",
                  control_type: {
                    id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                    description: "Normal Control",
                  },
                },
                time: 60,
                time_behind: null,
                position: null,
                cumulative_time: 60,
                cumulative_behind: null,
                cumulative_position: null,
              },
              {
                id: "string",
                is_intermediate: false,
                reading_time: "2025-06-27T09:03:00.000+00:00",
                points: 0,
                order_number: 2,
                control: {
                  id: "string",
                  station: "32",
                  control_type: {
                    id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                    description: "Normal Control",
                  },
                },
                time: 120,
                time_behind: null,
                position: null,
                cumulative_time: 180,
                cumulative_behind: null,
                cumulative_position: null,
              },
              {
                id: "string-finishSplit",
                is_intermediate: true,
                reading_time: "2025-06-27T09:07:00.000+00:00",
                points: 0,
                order_number: Infinity,
                control: null,
                time: 240,
                time_behind: null,
                position: null,
                cumulative_time: 420,
                cumulative_behind: null,
                cumulative_position: null,
              },
            ],
            online_splits: [],
          },
          overalls: null,
        },
        {
          id: "string",
          bib_number: "1234",
          is_nc: false,
          eligibility: null,
          sicard: "12345678",
          sex: "M",
          class: null,
          club: null,
          full_name: "full name 2",
          leg_number: 2,
          stage: {
            id: "string",
            result_type_id: "string",
            start_time: "2025-06-27T09:00:00.000+00:00",
            finish_time: "2025-06-27T09:07:00.000+00:00",
            upload_type: "res_splits",
            time_seconds: 420,
            position: 0,
            status_code: "0",
            time_behind: 0,
            time_neutralization: 0,
            time_adjusted: 0,
            time_penalty: 0,
            time_bonus: 0,
            points_final: 0,
            points_adjusted: 0,
            points_penalty: 0,
            points_bonus: 0,
            splits: [
              {
                id: "string",
                is_intermediate: false,
                reading_time: "2025-06-27T09:01:00.000+00:00",
                points: 0,
                order_number: 1,
                control: {
                  id: "string",
                  station: "31",
                  control_type: {
                    id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                    description: "Normal Control",
                  },
                },
                time: 60,
                time_behind: null,
                position: null,
                cumulative_time: 60,
                cumulative_behind: null,
                cumulative_position: null,
              },
              {
                id: "string",
                is_intermediate: false,
                reading_time: "2025-06-27T09:03:00.000+00:00",
                points: 0,
                order_number: 2,
                control: {
                  id: "string",
                  station: "32",
                  control_type: {
                    id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
                    description: "Normal Control",
                  },
                },
                time: 120,
                time_behind: null,
                position: null,
                cumulative_time: 180,
                cumulative_behind: null,
                cumulative_position: null,
              },
              {
                id: "string-finishSplit",
                is_intermediate: true,
                reading_time: "2025-06-27T09:07:00.000+00:00",
                points: 0,
                order_number: Infinity,
                control: null,
                time: 240,
                time_behind: null,
                position: null,
                cumulative_time: 420,
                cumulative_behind: null,
                cumulative_position: null,
              },
            ],
            online_splits: [],
          },
          overalls: null,
        },
      ],
    }

    // Actually compare
    const actual_runner = processRunnerData([runner])[0]
    const compare_runner = {
      ...actual_runner,
      runners: actual_runner.runners
        ? actual_runner.runners.map((runner) => ({
            ...runner,
            stage: {
              ...runner.stage,
              splits: runner.stage.splits.map((split) => ({
                ...split,
                reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
              })),
            },
          }))
        : actual_runner.runners,
    }
    const compare_expected_runner = {
      ...expected_runner,
      runners: expected_runner.runners
        ? expected_runner.runners.map((runner) => ({
            ...runner,
            stage: {
              ...runner.stage,
              splits: runner.stage.splits.map((split) => ({
                ...split,
                reading_time: split.reading_time ? DateTime.fromISO(split.reading_time) : null,
              })),
            },
          }))
        : expected_runner.runners,
    }

    expect(compare_runner).toEqual(compare_expected_runner)
  })
})
