import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { availableSplitsViews, SPLITS_VIEW, SplitsView } from "../../shared/splitsViews.ts"
import SplitsToolbar from "./SplitsToolbar.tsx"

const TIME_LOSS_LABEL = "Graphs.TimeLossAnalysis"
const NEXT_OPTION_KEY = "ArrowRight"
const STICKY_TOP_PX = 59

type ToolbarOptions = {
  hasRadios?: boolean
  isTimeLossAvailable?: boolean
  isTimeLossOn?: boolean
  selectedView?: SplitsView
}

function renderToolbar({
  hasRadios = false,
  isTimeLossAvailable = true,
  isTimeLossOn = false,
  selectedView = SPLITS_VIEW.Splits,
}: ToolbarOptions = {}) {
  const onTimeLossToggle = vi.fn()
  const onViewChange = vi.fn()
  render(
    <SplitsToolbar
      isTimeLossAvailable={isTimeLossAvailable}
      isTimeLossOn={isTimeLossOn}
      onTimeLossToggle={onTimeLossToggle}
      onViewChange={onViewChange}
      selectedView={selectedView}
      stickyTopPx={STICKY_TOP_PX}
      views={availableSplitsViews(hasRadios)}
    />,
  )
  return { onTimeLossToggle, onViewChange }
}

describe("SplitsToolbar", () => {
  it("sticks at the given distance from the top", () => {
    renderToolbar()

    expect(screen.getByRole("radiogroup").parentElement).toHaveStyle({
      top: `${STICKY_TOP_PX}px`,
    })
  })

  it("offers splits and accumulated times when the class has no radios", () => {
    renderToolbar()

    expect(screen.getAllByRole("radio")).toHaveLength(2)
  })

  it("offers the radios too when the class has them", () => {
    renderToolbar({ hasRadios: true })

    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("marks only the selected view as checked", () => {
    renderToolbar({ selectedView: SPLITS_VIEW.Accumulated })

    expect(screen.getByRole("radio", { checked: true })).toHaveTextContent("view.accumulated")
  })

  it("changes the view when another option is clicked", () => {
    const { onViewChange } = renderToolbar()

    fireEvent.click(screen.getByRole("radio", { name: "view.accumulated" }))

    expect(onViewChange).toHaveBeenCalledWith(SPLITS_VIEW.Accumulated)
  })

  it("changes the view with the arrow keys", () => {
    const { onViewChange } = renderToolbar()

    fireEvent.keyDown(screen.getByRole("radio", { checked: true }), { key: NEXT_OPTION_KEY })

    expect(onViewChange).toHaveBeenCalledWith(SPLITS_VIEW.Accumulated)
  })

  it("shows the time loss toggle in grey while it is off", () => {
    renderToolbar()
    const toggle = screen.getByRole("button", { name: TIME_LOSS_LABEL })

    expect(toggle).toHaveAttribute("aria-pressed", "false")
    expect(toggle).toHaveClass("border", "border-neutral-300", "text-neutral-500")
  })

  it("shows the time loss toggle in the primary colour while it is on", () => {
    renderToolbar({ isTimeLossOn: true })
    const toggle = screen.getByRole("button", { name: TIME_LOSS_LABEL })

    expect(toggle).toHaveAttribute("aria-pressed", "true")
    expect(toggle).toHaveClass("border", "border-primary", "text-primary")
  })

  it("toggles the time loss when the button is clicked", () => {
    const { onTimeLossToggle } = renderToolbar()

    fireEvent.click(screen.getByRole("button", { name: TIME_LOSS_LABEL }))

    expect(onTimeLossToggle).toHaveBeenCalledOnce()
  })

  it("keeps the time loss toggle visible but disabled when the view does not support it", () => {
    renderToolbar({ isTimeLossAvailable: false })

    expect(screen.getByRole("button", { name: TIME_LOSS_LABEL })).toBeDisabled()
  })

  it("shows a disabled time loss toggle as off even when it was left on", () => {
    renderToolbar({ isTimeLossAvailable: false, isTimeLossOn: true })
    const toggle = screen.getByRole("button", { name: TIME_LOSS_LABEL })

    expect(toggle).toHaveAttribute("aria-pressed", "false")
    expect(toggle).not.toHaveClass("border-primary")
  })

  it("ignores clicks on a disabled time loss toggle", () => {
    const { onTimeLossToggle } = renderToolbar({ isTimeLossAvailable: false })

    fireEvent.click(screen.getByRole("button", { name: TIME_LOSS_LABEL }))

    expect(onTimeLossToggle).not.toHaveBeenCalled()
  })
})
