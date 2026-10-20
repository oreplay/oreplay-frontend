import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import VirtualTicketSplitTime from "./VirtualTicketSplitTime.tsx"

describe("VirtualTicketSplitTime", () => {
  it("writes the time, the time behind and the position on one wrapping line", () => {
    render(<VirtualTicketSplitTime time={192} time_behind={8} position={4} />)
    const cell = screen.getByRole("cell")

    expect(cell).toHaveTextContent("03:12+00:08 (4)")
    expect(cell).toHaveClass("flex", "flex-wrap")
  })

  it("keeps the time in a fixed-width slot so the rest lines up across rows", () => {
    render(<VirtualTicketSplitTime time={192} time_behind={8} position={4} />)

    expect(screen.getByText("03:12")).toHaveClass("min-w-[38px]", "sm:min-w-[42px]")
  })

  it("makes the fastest time bold together with its standing", () => {
    render(<VirtualTicketSplitTime time={98} time_behind={0} position={1} />)

    expect(screen.getByRole("cell")).toHaveClass("font-bold")
    expect(screen.getByText("+00:00 (1)")).toHaveClass("text-neutral-800")
  })

  it("keeps a time that is not the fastest in normal weight", () => {
    render(<VirtualTicketSplitTime time={192} time_behind={8} position={4} />)

    expect(screen.getByRole("cell")).toHaveClass("font-normal")
  })

  it("shows only the time without a standing", () => {
    render(<VirtualTicketSplitTime time={192} />)

    expect(screen.getByRole("cell")).toHaveTextContent(/^03:12$/)
  })

  it("shows dashes in red for a missed control", () => {
    render(<VirtualTicketSplitTime time={null} isMissed />)

    expect(screen.getByText("--")).toHaveClass("text-red-700")
  })
})
