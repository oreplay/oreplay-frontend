import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import StageNameCell from "./StageNameCell.tsx"

const FINISHED_LABEL = "common:finished"

describe("StageNameCell", () => {
  it("marks a finished stage next to its name", () => {
    render(<StageNameCell name="Sprint" isEnded />)
    expect(screen.getByText("Sprint")).toBeInTheDocument()
    expect(screen.getByRole("img", { name: FINISHED_LABEL })).toBeInTheDocument()
  })

  it("shows only the name of a stage that is not finished", () => {
    render(<StageNameCell name="Sprint" isEnded={false} />)
    expect(screen.getByText("Sprint")).toBeInTheDocument()
    expect(screen.queryByRole("img", { name: FINISHED_LABEL })).not.toBeInTheDocument()
  })
})
