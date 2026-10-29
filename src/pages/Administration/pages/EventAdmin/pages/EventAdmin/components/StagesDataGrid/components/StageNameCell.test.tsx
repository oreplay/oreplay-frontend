import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import StageNameCell from "./StageNameCell.tsx"

const OFFICIAL_LABEL = "common:official"

describe("StageNameCell", () => {
  it("marks a finished stage as official next to its name", () => {
    render(<StageNameCell name="Sprint" isEnded />)
    expect(screen.getByText("Sprint")).toBeInTheDocument()
    expect(screen.getByText(OFFICIAL_LABEL)).toBeInTheDocument()
  })

  it("shows only the name of a stage that is not finished", () => {
    render(<StageNameCell name="Sprint" isEnded={false} />)
    expect(screen.getByText("Sprint")).toBeInTheDocument()
    expect(screen.queryByText(OFFICIAL_LABEL)).not.toBeInTheDocument()
  })
})
