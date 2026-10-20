import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import FootOVirtualTicketPoints from "./FootOVirtualTicketPoints.tsx"

const HELP_LABEL = "ResultsStage.VirtualTicket.FootO.Points.HelpLabel"
const HELP_MESSAGE = "ResultsStage.VirtualTicket.FootO.Points.HelpMsg"

describe("FootOVirtualTicketPoints", () => {
  it("shows the points with the formula hidden", () => {
    render(<FootOVirtualTicketPoints points={942} />)

    expect(screen.getByText("942")).toBeInTheDocument()
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("explains the formula when its info icon is clicked", () => {
    render(<FootOVirtualTicketPoints points={942} />)

    fireEvent.click(screen.getByRole("button", { name: HELP_LABEL }))

    expect(screen.getByRole("tooltip")).toHaveTextContent(HELP_MESSAGE)
  })
})
