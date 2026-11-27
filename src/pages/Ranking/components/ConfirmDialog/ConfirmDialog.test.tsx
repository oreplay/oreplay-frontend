import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ConfirmDialog from "./ConfirmDialog.tsx"

const renderDialog = (isConfirming: boolean) => {
  const onClose = vi.fn()
  render(
    <ConfirmDialog
      open
      title="Process event"
      confirmLabel="Confirm"
      closeLabel="Close"
      isConfirming={isConfirming}
      onConfirm={vi.fn()}
      onClose={onClose}
    />,
  )
  return { onClose }
}

describe("ConfirmDialog dismissal while confirming", () => {
  it("closes via backdrop, escape and close button when idle", () => {
    const { onClose } = renderDialog(false)

    fireEvent.click(screen.getByRole("presentation"))
    fireEvent.keyDown(document, { key: "Escape" })
    fireEvent.click(screen.getByRole("button", { name: "Close" }))

    expect(onClose).toHaveBeenCalledTimes(3)
  })

  it("ignores backdrop, escape and close button while confirming", () => {
    const { onClose } = renderDialog(true)

    fireEvent.click(screen.getByRole("presentation"))
    fireEvent.keyDown(document, { key: "Escape" })
    fireEvent.click(screen.getByRole("button", { name: "Close" }))

    expect(onClose).not.toHaveBeenCalled()
  })

  it("disables the close button while confirming", () => {
    renderDialog(true)

    expect(screen.getByRole("button", { name: "Close" })).toBeDisabled()
  })
})

describe("ConfirmDialog placement", () => {
  it("renders outside the form it is opened from, so Enter in its inputs never submits that form", () => {
    render(
      <form aria-label="Settings">
        <ConfirmDialog
          open
          title="Export"
          confirmLabel="Confirm"
          closeLabel="Close"
          onConfirm={vi.fn()}
          onClose={vi.fn()}
        >
          <input aria-label="Top count" />
        </ConfirmDialog>
      </form>,
    )

    expect(screen.getByRole("form", { name: "Settings" })).not.toContainElement(
      screen.getByRole("dialog"),
    )
  })
})
