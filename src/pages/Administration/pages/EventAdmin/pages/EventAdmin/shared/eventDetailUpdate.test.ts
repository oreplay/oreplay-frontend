import { describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { Data, EventDetailModel } from "../../../../../../../shared/EntityTypes.ts"
import { EventAdminFormValues } from "../../../components/EventAdminForm/EventAdminForm.tsx"
import { withEditedEventDetail } from "./eventDetailUpdate.ts"

const PREVIOUS = {
  data: { id: "event", description: "Old name", is_hidden: true, stages: [] },
} as unknown as Data<EventDetailModel>

const VALUES = {
  description: "New name",
  website: "https://example.com",
  organizer: null,
  startDate: DateTime.fromISO("2026-05-01"),
  endDate: DateTime.fromISO("2026-05-02"),
  scope: "local",
  isPublic: true,
  timezone: { id: "Europe/Madrid" },
  countryCode: "ES",
} as unknown as EventAdminFormValues

describe("withEditedEventDetail", () => {
  it("applies the edit inside the data envelope and keeps the other fields", () => {
    const edited = withEditedEventDetail(PREVIOUS, VALUES)

    expect(edited?.data.id).toBe("event")
    expect(edited?.data.description).toBe("New name")
    expect(edited?.data.is_hidden).toBe(false)
    expect(edited?.data.initial_date).toBe("2026-05-01")
    expect(edited?.data.timezone).toBe("Europe/Madrid")
    expect(edited?.data.stages).toBe(PREVIOUS.data.stages)
  })

  it("leaves an empty cache empty", () => {
    expect(withEditedEventDetail(undefined, VALUES)).toBeUndefined()
  })
})
