import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import SearchableSelect from "./SearchableSelect.tsx"

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Bravo" },
]

const renderSelect = (loading: boolean) =>
  render(
    <SearchableSelect
      label="Stage"
      value={null}
      onChange={vi.fn()}
      options={options}
      noResultsLabel="No results"
      loading={loading}
    />,
  )

describe("SearchableSelect loading state", () => {
  it("disables the input and marks it busy while loading", () => {
    renderSelect(true)

    const input = screen.getByRole("textbox")
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute("aria-busy", "true")
  })

  it("enables the input and is not busy when not loading", () => {
    renderSelect(false)

    const input = screen.getByRole("textbox")
    expect(input).toBeEnabled()
    expect(input).not.toHaveAttribute("aria-busy", "true")
  })
})
