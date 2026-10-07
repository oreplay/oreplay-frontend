import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import OnlineCourseToggle from "./OnlineCourseToggle.tsx"

const ACTIVE_ICON_CLASS = "text-primary"
const INACTIVE_ICON_CLASS = "text-neutral-400"
const HIDE_LABEL_KEY = "ResultsStage.OnlineCourse.Hide"
const SHOW_LABEL_KEY = "ResultsStage.OnlineCourse.Show"

/**
 * Renders the toggle and finds its button and icon.
 *
 * @param isActive Whether the online course is shown.
 * @param onToggle Listener of the toggle.
 * @returns The button and the icon inside it.
 */
function renderToggle(isActive: boolean, onToggle = vi.fn()) {
  render(<OnlineCourseToggle isActive={isActive} onToggle={onToggle} />)
  const button = screen.getByRole("button")
  return { button, icon: button.querySelector("svg") }
}

describe("OnlineCourseToggle", () => {
  it("has an orange icon and offers to hide the online course while it is shown", () => {
    const { button, icon } = renderToggle(true)

    expect(icon).toHaveClass(ACTIVE_ICON_CLASS)
    expect(button).toHaveAttribute("aria-pressed", "true")
    expect(button).toHaveAccessibleName(HIDE_LABEL_KEY)
  })

  it("has a grey icon and offers to show the online course while it is hidden", () => {
    const { button, icon } = renderToggle(false)

    expect(icon).toHaveClass(INACTIVE_ICON_CLASS)
    expect(button).toHaveAttribute("aria-pressed", "false")
    expect(button).toHaveAccessibleName(SHOW_LABEL_KEY)
  })

  it("names in its tooltip what a click does", () => {
    renderToggle(true)

    expect(screen.getByText(HIDE_LABEL_KEY)).toBeInTheDocument()
  })

  it("asks to switch when it is clicked", () => {
    const onToggle = vi.fn()
    const { button } = renderToggle(true, onToggle)

    fireEvent.click(button)

    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
