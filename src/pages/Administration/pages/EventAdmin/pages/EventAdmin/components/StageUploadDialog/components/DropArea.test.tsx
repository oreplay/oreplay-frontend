import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import DropArea from "./DropArea.tsx"

const xml = new File(["<ResultList/>"], "results.xml")

const renderDropArea = () => {
  const onFiles = vi.fn()
  render(<DropArea onFiles={onFiles} />)
  return { onFiles }
}

const dropOnArea = (files: File[]) =>
  fireEvent.drop(screen.getByTestId("upload-drop-area"), { dataTransfer: { files } })

describe("DropArea", () => {
  it("hands over the dropped files", () => {
    const { onFiles } = renderDropArea()

    dropOnArea([xml])

    expect(onFiles).toHaveBeenCalledWith([xml])
  })

  it("hands over the files picked with the file dialog", () => {
    const { onFiles } = renderDropArea()

    fireEvent.change(screen.getByTestId("upload-file-input"), { target: { files: [xml] } })

    expect(onFiles).toHaveBeenCalledWith([xml])
  })

  it("opens the file dialog when clicked anywhere", () => {
    renderDropArea()
    const onInputClick = vi.fn()
    screen.getByTestId("upload-file-input").addEventListener("click", onInputClick)

    fireEvent.click(screen.getByTestId("upload-drop-area"))

    expect(onInputClick).toHaveBeenCalledOnce()
  })
})
