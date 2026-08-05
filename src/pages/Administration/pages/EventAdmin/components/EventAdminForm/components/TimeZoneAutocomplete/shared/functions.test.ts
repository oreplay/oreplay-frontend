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

const offsetToMinutes = (offset: string): number => {
  const match = offset.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/)
  if (!match) return 0
  const sign = match[1] === "-" ? -1 : 1
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0))
}

const expectOffset = (timeZone: string, minutes: number) => {
  const offset = getOffset(timeZone)
  expect(offset, `offset for ${timeZone}: ${offset}`).toMatch(/^(GMT|UTC)/)
  expect(offsetToMinutes(offset), `offset for ${timeZone}: ${offset}`).toBe(minutes)
}

describe("getUserTimeZone", () => {
  it("returns the browser's IANA timezone", () => {
    expect(getUserTimeZone()).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone)
  })

  it("returns a timezone that resolves", () => {
    expect(DateTime.now().setZone(getUserTimeZone()).isValid).toBe(true)
  })
})

describe("getOffset", () => {
  it("reflects the summer-time offset", () => {
    freezeAt(SUMMER)
    expectOffset("Europe/Madrid", 2 * 60)
    expectOffset("America/Anchorage", -8 * 60)
  })

  it("reflects the standard-time offset", () => {
    freezeAt(WINTER)
    expectOffset("Europe/Madrid", 1 * 60)
    expectOffset("America/Anchorage", -9 * 60)
  })

  it("keeps a zero offset for UTC and handles fractional and +14 offsets", () => {
    freezeAt(SUMMER)
    expectOffset("UTC", 0)
    expectOffset("Asia/Kolkata", 5 * 60 + 30)
    expectOffset("Pacific/Kiritimati", 14 * 60)
  })

  it("never abbreviates the zone, even where an abbreviation exists", () => {
    freezeAt(SUMMER)
    expect(getOffset("America/Anchorage")).toMatch(/^GMT/)
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
    const { offset, ...rest } = timeZoneOptionGenerator("Europe/Madrid", "en")
    expect(rest).toEqual({
      id: "Europe/Madrid",
      city: "Madrid",
      region: "Europe",
      label: "Central European Summer Time",
    })
    expect(offsetToMinutes(offset)).toBe(2 * 60)
  })

  it("files a region-less zone under Other", () => {
    freezeAt(WINTER)
    const { offset, ...rest } = timeZoneOptionGenerator("UTC", "es")
    expect(rest).toEqual({
      id: "UTC",
      city: "UTC",
      region: "Other",
      label: "tiempo universal coordinado",
    })
    expect(offsetToMinutes(offset)).toBe(0)
  })
})
