import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { RESULT_STATUS_TEXT } from "../../../shared/constants.ts"
import VirtualTicketStatusChip from "./VirtualTicketStatusChip.tsx"

describe("VirtualTicketStatusChip", () => {
  it("names the status in full", () => {
    render(<VirtualTicketStatusChip status={RESULT_STATUS_TEXT.dns} />)

    expect(screen.getByText("ResultsStage.VirtualTicket.Status.dns")).toBeInTheDocument()
  })

  it("is red for a mispunch", () => {
    render(<VirtualTicketStatusChip status={RESULT_STATUS_TEXT.mp} />)

    expect(screen.getByText("ResultsStage.VirtualTicket.Status.mp")).toHaveClass("bg-red-100")
  })

  it("is grey for any other status", () => {
    render(<VirtualTicketStatusChip status={RESULT_STATUS_TEXT.dsq} />)
    const chip = screen.getByText("ResultsStage.VirtualTicket.Status.dsq")

    expect(chip).toHaveClass("bg-[#ececec]")
    expect(chip).not.toHaveClass("bg-red-100")
  })
})
