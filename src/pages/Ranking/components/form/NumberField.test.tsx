import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import NumberField from "./NumberField.tsx"

const LABEL = "Total circuit races"
const WARNING = "Does not match"
const ERROR = "Required"

describe("NumberField", () => {
  it("shows the warning with an amber border", () => {
    render(<NumberField label={LABEL} value={5} onChange={() => {}} warning={WARNING} />)

    expect(screen.getByText(WARNING)).toBeInTheDocument()
    expect(screen.getByRole("spinbutton")).toHaveClass("border-amber-500")
  })

  it("shows only the error when both are set", () => {
    render(
      <NumberField label={LABEL} value={5} onChange={() => {}} error={ERROR} warning={WARNING} />,
    )

    expect(screen.getByRole("alert")).toHaveTextContent(ERROR)
    expect(screen.queryByText(WARNING)).not.toBeInTheDocument()
    expect(screen.getByRole("spinbutton")).toHaveClass("border-red-500")
  })
})
