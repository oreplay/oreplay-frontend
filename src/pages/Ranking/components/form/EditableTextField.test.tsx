import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import EditableTextField from "./EditableTextField.tsx"

const renderField = (value: string) =>
  render(
    <EditableTextField
      label="Included classes"
      value={value}
      onChange={vi.fn()}
      editLabel="Edit"
      emptyLabel="All classes of the stage"
    />,
  )

describe("EditableTextField", () => {
  it("shows the value as text, with no input, until the edit button is used", () => {
    renderField("ME, FE")
    expect(screen.getByText("ME, FE")).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })

  it("turns into an input carrying the value when the edit button is clicked", () => {
    renderField("ME, FE")
    fireEvent.click(screen.getByRole("button", { name: "Edit" }))
    expect(screen.getByRole("textbox")).toHaveValue("ME, FE")
  })

  it("shows the empty label instead of a blank line for an empty value", () => {
    renderField("")
    expect(screen.getByText("All classes of the stage")).toBeInTheDocument()
  })
})
