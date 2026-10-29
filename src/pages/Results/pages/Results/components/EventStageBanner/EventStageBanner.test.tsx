import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import EventStageBanner from "./EventStageBanner.tsx"

const OFFICIAL_LABEL = "common:official"

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
})
