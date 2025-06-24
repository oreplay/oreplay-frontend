import { describe, it, expect } from "vitest"
import { orderedRunners } from "../functions.ts"
import { RunnerModel } from "../../../../shared/EntityTypes.ts"

describe("functions.orderedRunners", () => {
  it("return ordered splits", () => {
    const runner: RunnerModel = {
      id: "string",
      sex: "string",
      full_name: "string",
      bib_number: "string",
      is_nc: false,
      eligibility: "string",
      sicard: "1",
      leg_number: 1,
      class: {
        id: "string",
        short_name: "string",
        long_name: "string",
      },
      club: {
        id: "string",
        short_name: "string",
      },
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "string",
        finish_time: "string",
        upload_type: "string",
        time_seconds: 100,
        position: 1,
        status_code: "string",
        time_behind: 50,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        time_adjusted: 0,
        time_bonus: 0,
        time_neutralization: 0,
        time_penalty: 0,
        leg_number: 0,
        splits: [
          {
            id: "string",
            reading_time: "string",
            order_number: 2,
            points: 0,
            control: {
              id: "string",
              station: "32",
              control_type: {
                id: "string",
                description: "string",
              },
            },
            is_intermediate: false,
          },
          {
            id: "string",
            reading_time: "string",
            order_number: 1,
            points: 0,
            control: {
              id: "string",
              station: "31",
              control_type: {
                id: "string",
                description: "string",
              },
            },
            is_intermediate: false,
          },
        ],
      },
      runners: null,
      overalls: null,
    }
    const ordered = orderedRunners([runner])
    expect(ordered[0].stage.splits[0].control.station).toEqual("31")
    expect(ordered[0].stage.splits[1].control.station).toEqual("32")
  })
})
