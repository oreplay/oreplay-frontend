import { describe, it, expect } from "vitest"
import { orderedRunners } from "../functions.ts"
import { RunnerModel } from "../../../../shared/EntityTypes.ts"

describe("functions.orderedRunners", () => {
  it("return ordered splits", () => {
    const runner: RunnerModel = {
      id: "string",
      full_name: "string",
      bib_number: "string",
      is_nc: false,
      eligibility: "string",
      sicard: BigInt(2005566),
      leg_number: 1,
      class: {
        id: "string",
        short_name: "string",
        splits: [],
      },
      club: {
        id: "string",
        short_name: "string",
      },
      stage: {
        is_intermediate: false,
        result_type_id: "string",
        start_time: "string",
        finish_time: "string",
        upload_type: "string",
        time_seconds: "string",
        position: BigInt(1),
        status_code: "string",
        time_behind: 50,
        points_final: BigInt(0),
        points_adjusted: BigInt(0),
        points_penalty: BigInt(0),
        points_bonus: BigInt(0),
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
