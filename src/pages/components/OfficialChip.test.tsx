import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import OfficialChip from "./OfficialChip.tsx"
import { OFFICIAL_CHIP_SIZE } from "../shared/officialChipSizes.ts"

const OFFICIAL_LABEL = "common:official"
const TOOLTIP = "Confirmed by the organizer"

describe("OfficialChip", () => {
  it("shows the Official label", () => {
    render(<OfficialChip tooltip={TOOLTIP} />)
    expect(screen.getByText(OFFICIAL_LABEL)).toBeInTheDocument()
  })

  it("hides the seal icon from assistive technology", () => {
    const { container } = render(
      <OfficialChip tooltip={TOOLTIP} size={OFFICIAL_CHIP_SIZE.Compact} />,
    )
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("explains the chip in a tooltip on hover", async () => {
    render(<OfficialChip tooltip={TOOLTIP} />)
    fireEvent.mouseOver(screen.getByText(OFFICIAL_LABEL))
    expect(await screen.findByRole("tooltip")).toHaveTextContent(TOOLTIP)
  })

  it("keeps the Official label as the chip's accessible name", () => {
    render(<OfficialChip tooltip={TOOLTIP} />)
    expect(screen.getByText(OFFICIAL_LABEL).closest("[tabindex]")).not.toHaveAttribute("aria-label")
  })
})
