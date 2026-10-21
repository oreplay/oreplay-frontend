import { describe, expect, it } from "vitest"
import {
  DESKTOP_EVENTS_ROWS_PER_PAGE,
  desktopEventsPageSize,
  EVENTS_GRID_COLUMNS,
  eventsGridColumnCount,
} from "./eventsGridLayout.ts"

const BREAKPOINTS = { sm: 600, md: 900 }

describe("eventsGridColumnCount", () => {
  it.each([
    [320, EVENTS_GRID_COLUMNS.xs],
    [599, EVENTS_GRID_COLUMNS.xs],
    [600, EVENTS_GRID_COLUMNS.sm],
    [899, EVENTS_GRID_COLUMNS.sm],
    [900, EVENTS_GRID_COLUMNS.md],
    [2560, EVENTS_GRID_COLUMNS.md],
  ])("uses the breakpoint columns at %ipx", (width, columns) => {
    expect(eventsGridColumnCount(width, BREAKPOINTS)).toBe(columns)
  })
})

describe("desktopEventsPageSize", () => {
  it.each([
    [320, EVENTS_GRID_COLUMNS.xs],
    [700, EVENTS_GRID_COLUMNS.sm],
    [1440, EVENTS_GRID_COLUMNS.md],
  ])("fills a fixed number of full rows at %ipx", (width, columns) => {
    expect(desktopEventsPageSize(width, BREAKPOINTS)).toBe(DESKTOP_EVENTS_ROWS_PER_PAGE * columns)
  })
})
