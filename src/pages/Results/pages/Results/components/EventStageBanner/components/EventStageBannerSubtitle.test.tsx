import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import EventStageBannerSubtitle from "./EventStageBannerSubtitle.tsx"

const SUBTITLE = "Spring Cup"
const EVENT_PATH = "/competitions/event-1"

describe("EventStageBannerSubtitle", () => {
  it("links to the given destination", () => {
    render(
      <MemoryRouter>
        <EventStageBannerSubtitle text={SUBTITLE} to={EVENT_PATH} />
      </MemoryRouter>,
    )

    expect(screen.getByRole("link", { name: SUBTITLE })).toHaveAttribute("href", EVENT_PATH)
  })

  it("renders plain text without a destination", () => {
    render(<EventStageBannerSubtitle text={SUBTITLE} />)

    expect(screen.getByText(SUBTITLE)).toBeInTheDocument()
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })
})
