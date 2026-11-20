import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ClassNamesText from "./ClassNamesText.tsx"

const WARNING_CLASS = "text-amber-600"

const renderText = (value: string) =>
  render(<ClassNamesText value={value} unknownPatternLabel="Unusual class name" />)

describe("ClassNamesText", () => {
  it("highlights only the names that do not follow the pattern", () => {
    renderText("M-21, Senior, W-E")
    expect(screen.getByText("Senior")).toHaveClass(WARNING_CLASS)
    expect(screen.getByText("M-21")).not.toHaveClass(WARNING_CLASS)
    expect(screen.getByText("W-E")).not.toHaveClass(WARNING_CLASS)
  })

  it("explains the highlight through the title of the name", () => {
    renderText("Senior")
    expect(screen.getByText("Senior")).toHaveAttribute("title", "Unusual class name")
  })

  it("keeps the names comma separated", () => {
    const { container } = renderText("M-21, Senior")
    expect(container.textContent).toBe("M-21, Senior")
  })
})
