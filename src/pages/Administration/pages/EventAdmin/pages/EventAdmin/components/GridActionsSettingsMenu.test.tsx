import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { forwardRef, ReactNode } from "react"
import GridActionsSettingsMenu from "./GridActionsSettingsMenu.tsx"

vi.mock("@mui/x-data-grid", () => ({
  GridActionsCellItem: forwardRef<
    HTMLButtonElement,
    { icon: ReactNode; label: string; onClick: () => void }
  >(function GridActionsCellItem({ icon, label, ...buttonProps }, ref) {
    return (
      <button ref={ref} aria-label={label} {...buttonProps}>
        {icon}
      </button>
    )
  }),
}))

const renderMenu = (isStageEnded: boolean, handleSetStageEndedClick: () => void) =>
  render(
    <GridActionsSettingsMenu
      isStageEnded={isStageEnded}
      handleDeleteClick={vi.fn()}
      handleEditClick={vi.fn()}
      handleSetStageEndedClick={handleSetStageEndedClick}
      handleWipeOutRunnersClick={vi.fn()}
      handleStatsClick={vi.fn()}
    />,
  )

const confirmStageEndedFrom = (keyPrefix: string) => {
  fireEvent.click(screen.getByRole("button", { name: "Settings" }))
  fireEvent.click(screen.getByText(`${keyPrefix}.MenuText`))
  fireEvent.click(screen.getByText(`${keyPrefix}.DialogConfirm`))
}

describe("GridActionsSettingsMenu", () => {
  it("offers to finish a stage that is not finished yet", () => {
    const setStageEnded = vi.fn()
    renderMenu(false, setStageEnded)

    confirmStageEndedFrom("EventAdmin.Stages.FinishStage")

    expect(setStageEnded).toHaveBeenCalledWith(true)
  })

  it("offers to reopen a stage that is already finished", () => {
    const setStageEnded = vi.fn()
    renderMenu(true, setStageEnded)

    confirmStageEndedFrom("EventAdmin.Stages.FinishStage.Undo")

    expect(setStageEnded).toHaveBeenCalledWith(false)
  })
})
