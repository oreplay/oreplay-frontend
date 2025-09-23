import { describe, it, expect } from "vitest"
import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import {
  ProcessedSplitModel,
  RadioSplitModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getOnlineSplits } from "./footOSplitsTablefunctions.ts"
import { DateTime } from "luxon"

describe("getOnlineSplits", () => {
  const radiosList: OnlineControlModel[] = [
    {
      id: "string1",
      station: "31",
    },
    {
      id: "string2",
      station: "41",
    },
    {
      id: "string3",
      station: "51",
    },
  ]

  const baseControl = {
    control: {
      control_type: {
        description: "Normal Control",
        id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
      },
      id: "control",
      station: "30",
    },
    cumulative_behind: null,
    cumulative_position: null,
    cumulative_time: null,
    id: "string",
    is_intermediate: true,
    order_number: 0,
    points: 0,
    position: null,
    reading_time: null,
    time: null,
    time_behind: null,
  }

  const startTime = "2025-08-05T09:00:00.000+00:00"

  it("should handle a runner without splits", () => {
    const splitList: ProcessedSplitModel[] = []

    const expectedSplits: RadioSplitModel[] = [
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "missingRadio-control-31",
          station: "31",
        },
        id: "missingRadio-31",
        is_next: DateTime.fromISO(startTime),
        order_number: 1,
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "missingRadio-control-41",
          station: "41",
        },
        id: "missingRadio-41",
        is_next: null,
        order_number: 2,
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "missingRadio-control-51",
          station: "51",
        },
        id: "missingRadio-51",
        is_next: null,
        order_number: 3,
      },
      {
        ...baseControl,
        control: null,
        id: "missingFinish",
        order_number: Infinity,
        is_next: null,
      },
    ]

    const actual = getOnlineSplits(splitList, radiosList, startTime)
    expect(actual).toEqual(expectedSplits)
  })

  it("should get online splits when there are only online splits'", () => {
    const splitList: ProcessedSplitModel[] = [
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-31",
          station: "31",
        },
        id: "31",
        order_number: 1,
        time: 60,
        cumulative_time: 60,
        reading_time: "2025-08-05T09:01:00.000+00:00",
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-41",
          station: "41",
        },
        id: "41",
        order_number: 2,
        time: 120,
        cumulative_time: 180,
        reading_time: "2025-08-05T09:03:00.000+00:00",
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-51",
          station: "51",
        },
        id: "51",
        order_number: 3,
        time: 240,
        cumulative_time: 420,
        reading_time: "2025-08-05T09:07:00.000+00:00",
      },
      {
        ...baseControl,
        control: null,
        id: "finish",
        order_number: Infinity,
        time: 10,
        cumulative_time: 430,
        reading_time: "2025-08-05T09:07:10.000+00:00",
      },
    ]

    const expectedSplits = splitList.map((split) => {
      return { ...split, is_next: null }
    })

    const actual = getOnlineSplits(splitList, radiosList, startTime)

    expect(actual).toEqual(expectedSplits)
  })

  it("should handle missing online punches", () =>{

    const splitList: ProcessedSplitModel[] = [
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-41",
          station: "41",
        },
        id: "41",
        order_number: 2,
        time: 120,
        cumulative_time: 180,
        reading_time: "2025-08-05T09:03:00.000+00:00",
      },
      {
        ...baseControl,
        control: null,
        id: "finish",
        order_number: Infinity,
        time: null,
        cumulative_time: null,
        reading_time: null,
      },
    ]

    const expectedOnlineSplitList: RadioSplitModel[] = [
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "missingRadio-control-31",
          station: "31",
        },
        id: "missingRadio-31",
        is_next: null,
        order_number: 1,
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-41",
          station: "41",
        },
        id: "41",
        is_next: null,
        order_number: 2,
        time: 120,
        cumulative_time: 180,
        reading_time: "2025-08-05T09:03:00.000+00:00",
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "missingRadio-control-51",
          station: "51",
        },
        id: "missingRadio-51",
        is_next: DateTime.fromISO("2025-08-05T09:03:00.000+00:00"),
        order_number: 3,
      },
      {
        ...baseControl,
        control: null,
        id: "finish",
        order_number: Infinity,
        is_next: null,
      },
    ]

    const actual = getOnlineSplits(splitList, radiosList, startTime)
    expect(actual).toEqual(expectedOnlineSplitList)


  })

  it("should get online splits when there is a full chip reading", () => {
    const splitList: ProcessedSplitModel[] = [
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-31",
          station: "31",
        },
        id: "31",
        order_number: 1,
        time: 60,
        cumulative_time: 60,
        reading_time: "2025-08-05T09:01:00.000+00:00",
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-32",
          station: "32",
        },
        id: "32",
        order_number: 2,
        time: 120,
        cumulative_time: 180,
        reading_time: "2025-08-05T09:03:00.000+00:00",
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-41",
          station: "41",
        },
        id: "41",
        order_number: 3,
        time: 60,
        cumulative_time: 240,
        reading_time: "2025-08-05T09:04:00.000+00:00",
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-42",
          station: "42",
        },
        id: "42",
        order_number: 4,
        time: 130,
        cumulative_time: 370,
        reading_time: "2025-08-05T09:06:10.000+00:00",
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-51",
          station: "51",
        },
        id: "51",
        order_number: 5,
        time: 50,
        cumulative_time: 420,
        reading_time: "2025-08-05T09:07:00.000+00:00",
      },
      {
        ...baseControl,
        control: null,
        id: "finish",
        order_number: Infinity,
        time: 10,
        cumulative_time: 440,
        reading_time: "2025-08-05T09:07:10.000+00:00",
      },
    ]

    const expectedOnlineControls: RadioSplitModel[] = [
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-31",
          station: "31",
        },
        id: "31",
        is_next: null,
        order_number: 1,
        time: 60,
        cumulative_time: 60,
        reading_time: "2025-08-05T09:01:00.000+00:00",
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-41",
          station: "41",
        },
        id: "41",
        is_next: null,
        order_number: 3,
        time: 60,
        cumulative_time: 240,
        reading_time: "2025-08-05T09:04:00.000+00:00",
      },
      {
        ...baseControl,
        control: {
          ...baseControl.control,
          id: "control-51",
          station: "51",
        },
        id: "51",
        is_next: null,
        order_number: 5,
        time: 50,
        cumulative_time: 420,
        reading_time: "2025-08-05T09:07:00.000+00:00",
      },
      {
        ...baseControl,
        control: null,
        id: "finish",
        is_next: null,
        order_number: Infinity,
        time: 10,
        cumulative_time: 440,
        reading_time: "2025-08-05T09:07:10.000+00:00",
      },
    ]

    const actual = getOnlineSplits(splitList, radiosList, startTime)

    expect(actual).toEqual(expectedOnlineControls)
  })
})
