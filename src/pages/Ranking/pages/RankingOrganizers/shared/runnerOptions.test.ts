import { describe, expect, it } from "vitest"
import { toRunnerOptions } from "./runnerOptions.ts"

describe("toRunnerOptions", () => {
  it("labels each runner with its name and shows its class as detail", () => {
    expect(
      toRunnerOptions([
        {
          id: "runner-1",
          first_name: "Felipe",
          last_name: "Peña Pita",
          class: { id: "class-1", long_name: "Hombres 35", short_name: "H-35" },
        },
      ]),
    ).toEqual([{ id: "runner-1", label: "Felipe Peña Pita", detail: "H-35" }])
  })

  it("leaves the detail empty for a runner without class", () => {
    expect(toRunnerOptions([{ id: "runner-2", first_name: "Ana", last_name: "Rey" }])).toEqual([
      { id: "runner-2", label: "Ana Rey", detail: undefined },
    ])
  })
})
