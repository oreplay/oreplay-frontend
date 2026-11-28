import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import CompetitionResultsLink from "./CompetitionResultsLink.tsx"

const renderLink = () =>
  render(
    <MemoryRouter>
      <CompetitionResultsLink eventId="evt-1" stageId="stg-2" />
    </MemoryRouter>,
  )

describe("CompetitionResultsLink", () => {
  it("points at the results page of the given stage", () => {
    renderLink()
    expect(screen.getByRole("link")).toHaveAttribute("href", "/competitions/evt-1/stg-2")
  })

  it("keeps the results in the same tab", () => {
    renderLink()
    expect(screen.getByRole("link")).not.toHaveAttribute("target")
  })
})
