import { describe, expect, it } from "vitest"
import { Event } from "../../../../../domain/types/v1api"
import { toEventOptions } from "./eventOptions.ts"

const event = (id: string, description: string) => ({ id, description }) as Event

describe("toEventOptions", () => {
  it("maps the listed events to options", () => {
    expect(toEventOptions([event("a", "Alpha")], undefined)).toEqual([
      { value: "a", label: "Alpha" },
    ])
  })

  it("prepends the selected event when the list does not contain it", () => {
    expect(toEventOptions([event("a", "Alpha")], event("b", "Beta"))).toEqual([
      { value: "b", label: "Beta" },
      { value: "a", label: "Alpha" },
    ])
  })

  it("does not duplicate the selected event when it is already listed", () => {
    expect(toEventOptions([event("a", "Alpha")], event("a", "Alpha"))).toEqual([
      { value: "a", label: "Alpha" },
    ])
  })
})
