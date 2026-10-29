import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import StageEndedIcon from "./StageEndedIcon.tsx"

describe("StageEndedIcon", () => {
  it("is announced as finished", () => {
    render(<StageEndedIcon />)
    expect(screen.getByRole("img", { name: "common:finished" })).toBeInTheDocument()
  })
})
