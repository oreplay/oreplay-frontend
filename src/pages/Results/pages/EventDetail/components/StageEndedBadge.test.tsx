import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import StageEndedBadge from "./StageEndedBadge.tsx"

describe("StageEndedBadge", () => {
  it("keeps a tap on the badge from opening the stage", () => {
    const openStage = vi.fn()
    render(
      <div onClick={openStage}>
        <StageEndedBadge />
      </div>,
    )
    fireEvent.click(screen.getByRole("img", { name: "common:finished" }))
    expect(openStage).not.toHaveBeenCalled()
  })
})
