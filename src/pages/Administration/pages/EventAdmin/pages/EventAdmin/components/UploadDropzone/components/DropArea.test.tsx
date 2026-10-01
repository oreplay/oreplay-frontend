import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import DropArea from "./DropArea.tsx"

const xml = new File(["<ResultList/>"], "results.xml")

const renderDropArea = (disabled: boolean, isUploading = false) => {
  const onFiles = vi.fn()
  render(<DropArea disabled={disabled} isUploading={isUploading} onFiles={onFiles} />)
  return { onFiles }
}

const dropOnArea = (files: File[]) =>
  fireEvent.drop(screen.getByTestId("upload-drop-area"), { dataTransfer: { files } })

describe("DropArea", () => {
  it("hands over the dropped files", () => {
    const { onFiles } = renderDropArea(false)

    dropOnArea([xml])

    expect(onFiles).toHaveBeenCalledWith([xml])
  })

  it("hands over the files picked with the file dialog", () => {
    const { onFiles } = renderDropArea(false)

    fireEvent.change(screen.getByTestId("upload-file-input"), { target: { files: [xml] } })

    expect(onFiles).toHaveBeenCalledWith([xml])
  })

  it("ignores drops while disabled or uploading", () => {
    const disabled = renderDropArea(true)
    dropOnArea([xml])
    expect(disabled.onFiles).not.toHaveBeenCalled()
  })

  it("disables the file dialog button while uploading", () => {
    renderDropArea(false, true)

    expect(screen.getByRole("button")).toBeDisabled()
  })
})
