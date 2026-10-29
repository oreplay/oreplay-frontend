import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { DateTime } from "luxon"
import EventStageBanner from "./EventStageBanner.tsx"
import { LIVE_UPDATE_WINDOW } from "../../shared/stageLastUpdate.ts"

const OFFICIAL_LABEL = "common:official"
const LAST_UPDATED_LABEL = "ResultsStage.lastUpdated"
const LIVE_ICON = "WifiTetheringIcon"
const NOT_LIVE_ICON = "WifiTetheringOffIcon"

/**
 * Renders the banner of a multi-stage event's stage.
 * @param isOfficial Whether the stage is finished, or undefined to leave the prop out.
 */
const renderBanner = (isOfficial?: boolean) =>
  render(
    <EventStageBanner
      eventName="Spring Cup"
      stageName="Sprint"
      singleStage={false}
      isOfficial={isOfficial}
    />,
  )

/**
 * Renders the banner of a multi-stage event's stage that received results at a given moment.
 * @param lastUpdate Moment of the latest upload, or null when there is none.
 */
const renderBannerUpdatedAt = (lastUpdate: DateTime | null) =>
  render(
    <EventStageBanner
      eventName="Spring Cup"
      stageName="Sprint"
      singleStage={false}
      lastUpdate={lastUpdate}
    />,
  )

describe("EventStageBanner", () => {
  it("marks a finished stage as official in the header", () => {
    renderBanner(true)
    expect(screen.getByText("Sprint")).toBeInTheDocument()
    expect(screen.getByText(OFFICIAL_LABEL)).toBeInTheDocument()
  })

  it("shows no Official chip for a stage that is not finished", () => {
    renderBanner(false)
    expect(screen.queryByText(OFFICIAL_LABEL)).not.toBeInTheDocument()
  })

  it("shows no Official chip when the stage's state is unknown", () => {
    renderBanner()
    expect(screen.queryByText(OFFICIAL_LABEL)).not.toBeInTheDocument()
  })

  it("shows the stage as live right after an upload", () => {
    renderBannerUpdatedAt(DateTime.now())
    expect(screen.getByRole("img", { name: LAST_UPDATED_LABEL })).toBeInTheDocument()
    expect(screen.getByTestId(LIVE_ICON)).toBeInTheDocument()
  })

  it("shows the stage as not live once uploads stopped", () => {
    renderBannerUpdatedAt(DateTime.now().minus(LIVE_UPDATE_WINDOW).minus({ minutes: 1 }))
    expect(screen.getByTestId(NOT_LIVE_ICON)).toBeInTheDocument()
    expect(screen.queryByTestId(LIVE_ICON)).not.toBeInTheDocument()
  })

  it("shows no live status for a stage without uploads", () => {
    renderBannerUpdatedAt(null)
    expect(screen.queryByRole("img", { name: LAST_UPDATED_LABEL })).not.toBeInTheDocument()
  })
})
