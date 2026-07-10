import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { DateTime } from "luxon"
import {
  formatCity,
  getLocalizedName,
  getOffset,
  getUserTimeZone,
  timeZoneOptionGenerator,
} from "./functions.ts"

// Offsets and localized names flip with DST, so every assertion runs at a frozen
// instant: one inside northern-hemisphere summer, one inside winter.
const SUMMER = "2025-07-01T12:00:00Z"
const WINTER = "2025-01-15T12:00:00Z"

const freezeAt = (iso: string) => vi.setSystemTime(DateTime.fromISO(iso).toMillis())

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe("getUserTimeZone", () => {
  it("returns the browser's IANA timezone", () => {
    expect(getUserTimeZone()).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone)
  })

  it("returns a timezone that resolves", () => {
    expect(DateTime.now().setZone(getUserTimeZone()).isValid).toBe(true)
  })
})

describe("getOffset", () => {
  it("formats the offset as GMT±h during summer time", () => {
    freezeAt(SUMMER)
    expect(getOffset("Europe/Madrid")).toBe("GMT+2")
    expect(getOffset("America/Anchorage")).toBe("GMT-8")
  })

  it("formats the offset as GMT±h during standard time", () => {
    freezeAt(WINTER)
    expect(getOffset("Europe/Madrid")).toBe("GMT+1")
    expect(getOffset("America/Anchorage")).toBe("GMT-9")
  })

  it("keeps a plain GMT for UTC and handles fractional and +14 offsets", () => {
    freezeAt(SUMMER)
    expect(getOffset("UTC")).toBe("GMT")
    expect(getOffset("Asia/Kolkata")).toBe("GMT+5:30")
    expect(getOffset("Pacific/Kiritimati")).toBe("GMT+14")
  })

  it("never abbreviates the zone, even where an abbreviation exists", () => {
    freezeAt(SUMMER)
    expect(getOffset("America/Anchorage")).not.toBe("AKDT")
  })
})

describe("getLocalizedName", () => {
  it("names the zone in the requested locale during summer time", () => {
    freezeAt(SUMMER)
    expect(getLocalizedName("Europe/Madrid", "en")).toBe("Central European Summer Time")
    expect(getLocalizedName("Europe/Madrid", "es")).toBe("hora de verano de Europa central")
    expect(getLocalizedName("America/Anchorage", "en")).toBe("Alaska Daylight Time")
  })

  it("names the zone in the requested locale during standard time", () => {
    freezeAt(WINTER)
    expect(getLocalizedName("Europe/Madrid", "en")).toBe("Central European Standard Time")
    expect(getLocalizedName("Europe/Madrid", "es")).toBe("hora estándar de Europa central")
    expect(getLocalizedName("America/Anchorage", "en")).toBe("Alaska Standard Time")
  })

  it("names UTC the same all year", () => {
    freezeAt(SUMMER)
    expect(getLocalizedName("UTC", "en")).toBe("Coordinated Universal Time")
    freezeAt(WINTER)
    expect(getLocalizedName("UTC", "en")).toBe("Coordinated Universal Time")
  })
})

describe("formatCity", () => {
  it("takes the segment after the region and unescapes underscores", () => {
    expect(formatCity("Europe/Madrid")).toBe("Madrid")
    expect(formatCity("America/New_York")).toBe("New York")
  })

  it("returns the id unchanged when there is no region", () => {
    expect(formatCity("UTC")).toBe("UTC")
  })

  it("uses the middle segment for three-part ids", () => {
    expect(formatCity("America/Argentina/Buenos_Aires")).toBe("Argentina")
  })
})

describe("timeZoneOptionGenerator", () => {
  it("builds the option for a region/city zone", () => {
    freezeAt(SUMMER)
    expect(timeZoneOptionGenerator("Europe/Madrid", "en")).toEqual({
      id: "Europe/Madrid",
      city: "Madrid",
      region: "Europe",
      offset: "GMT+2",
      label: "Central European Summer Time",
    })
  })

  it("files a region-less zone under Other", () => {
    freezeAt(WINTER)
    expect(timeZoneOptionGenerator("UTC", "es")).toEqual({
      id: "UTC",
      city: "UTC",
      region: "Other",
      offset: "GMT",
      label: "tiempo universal coordinado",
    })
  })
})
