import { describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
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

const WIPE_OUT_MENU_TEXT = "EventAdmin.Stages.WipeOutRunners.MenuText"
const DELETE_MENU_TEXT = "EventAdmin.Stages.DeleteStage.MenuText"

/**
 * Finds the settings menu entry that shows the given text.
 * @param text Untranslated key the entry renders as its label.
 * @returns The menu item element.
 */
const getMenuItem = (text: string) => screen.getByText(text).closest('[role="menuitem"]')

const FINISH_CONFIRM_TEXT = "EventAdmin.Stages.FinishStage.DialogConfirm"
const FINISH_TITLE_TEXT = "EventAdmin.Stages.FinishStage.DialogTitle"

/**
 * Renders the settings menu of a stage.
 * @param isStageEnded Whether the stage's results are official.
 * @param handleSetStageEndedClick Stand-in for the action that changes the official state.
 * @returns The render result, whose `rerender` takes a new menu element.
 */
const renderMenu = (
  isStageEnded: boolean,
  handleSetStageEndedClick: (shouldBeEnded: boolean) => Promise<void>,
) => render(createMenu(isStageEnded, handleSetStageEndedClick))

/**
 * Builds the settings menu element of a stage.
 * @param isStageEnded Whether the stage's results are official.
 * @param handleSetStageEndedClick Stand-in for the action that changes the official state.
 * @returns The menu element.
 */
const createMenu = (
  isStageEnded: boolean,
  handleSetStageEndedClick: (shouldBeEnded: boolean) => Promise<void>,
) => (
  <GridActionsSettingsMenu
    isStageEnded={isStageEnded}
    handleDeleteClick={vi.fn()}
    handleEditClick={vi.fn()}
    handleSetStageEndedClick={handleSetStageEndedClick}
    handleWipeOutRunnersClick={vi.fn()}
    handleStatsClick={vi.fn()}
  />
)

/**
 * Builds an official-state action that stays pending until the test settles it.
 * @returns The action and the function that settles its promise.
 */
const createPendingAction = () => {
  let settle = () => {}
  const action = vi.fn(() => new Promise<void>((resolve) => (settle = resolve)))
  return { action, settle: () => settle() }
}

const confirmStageEndedFrom = (keyPrefix: string) => {
  fireEvent.click(screen.getByRole("button", { name: "Settings" }))
  fireEvent.click(screen.getByText(`${keyPrefix}.MenuText`))
  fireEvent.click(screen.getByText(`${keyPrefix}.DialogConfirm`))
}

describe("GridActionsSettingsMenu", () => {
  it("offers to finish a stage that is not finished yet", () => {
    const setStageEnded = vi.fn(() => Promise.resolve())
    renderMenu(false, setStageEnded)

    confirmStageEndedFrom("EventAdmin.Stages.FinishStage")

    expect(setStageEnded).toHaveBeenCalledWith(true)
  })

  it("offers to reopen a stage that is already finished", () => {
    const setStageEnded = vi.fn(() => Promise.resolve())
    renderMenu(true, setStageEnded)

    confirmStageEndedFrom("EventAdmin.Stages.FinishStage.Undo")

    expect(setStageEnded).toHaveBeenCalledWith(false)
  })

  it("confirms making a stage official with a non-destructive button", () => {
    renderMenu(
      false,
      vi.fn(() => Promise.resolve()),
    )
    fireEvent.click(screen.getByRole("button", { name: "Settings" }))
    fireEvent.click(screen.getByText("EventAdmin.Stages.FinishStage.MenuText"))

    const confirmButton = screen.getByRole("button", { name: FINISH_CONFIRM_TEXT })
    expect(confirmButton).toHaveClass("MuiButton-colorPrimary")
  })

  it("shows a spinner in the confirm button until the stage has been made official", async () => {
    const { action, settle } = createPendingAction()
    renderMenu(false, action)

    confirmStageEndedFrom("EventAdmin.Stages.FinishStage")

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: FINISH_CONFIRM_TEXT })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled()

    act(() => settle())

    await waitFor(() => expect(screen.queryByText(FINISH_TITLE_TEXT)).not.toBeInTheDocument())
  })

  it("keeps the dialog's wording while the stage becomes official behind it", () => {
    const { action } = createPendingAction()
    const { rerender } = renderMenu(false, action)

    confirmStageEndedFrom("EventAdmin.Stages.FinishStage")
    rerender(createMenu(true, action))

    expect(screen.getByText(FINISH_TITLE_TEXT)).toBeInTheDocument()
  })

  it("disables wiping and deleting a stage whose results are official", () => {
    renderMenu(
      true,
      vi.fn(() => Promise.resolve()),
    )
    fireEvent.click(screen.getByRole("button", { name: "Settings" }))

    expect(getMenuItem(WIPE_OUT_MENU_TEXT)).toHaveAttribute("aria-disabled", "true")
    expect(getMenuItem(DELETE_MENU_TEXT)).toHaveAttribute("aria-disabled", "true")
  })

  it("lets the organizer wipe and delete a stage that is not official", () => {
    renderMenu(
      false,
      vi.fn(() => Promise.resolve()),
    )
    fireEvent.click(screen.getByRole("button", { name: "Settings" }))

    expect(getMenuItem(WIPE_OUT_MENU_TEXT)).not.toHaveAttribute("aria-disabled")
    expect(getMenuItem(DELETE_MENU_TEXT)).not.toHaveAttribute("aria-disabled")
  })
})
