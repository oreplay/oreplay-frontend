import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import SegmentedControl from "./SegmentedControl.tsx"
import { SEGMENTED_CONTROL_MODE, SegmentedControlOption } from "./shared/segmentedControl.ts"

const FRUIT = { Apple: "apple", Banana: "banana", Cherry: "cherry" } as const
type Fruit = (typeof FRUIT)[keyof typeof FRUIT]

const GROUP_LABEL = "fruits"
const FIRST_OPTION_KEY = "Home"
const NEXT_OPTION_KEY = "ArrowRight"
const PREVIOUS_OPTION_KEY = "ArrowLeft"

const OPTIONS: readonly SegmentedControlOption<Fruit>[] = [
  { icon: <svg />, key: FRUIT.Apple, labelKey: "fruit.apple" },
  {
    icon: <svg />,
    key: FRUIT.Banana,
    labelKey: "fruit.banana",
    shortLabelKey: "fruit.bananaShort",
  },
  { icon: <svg />, key: FRUIT.Cherry, labelKey: "fruit.cherry" },
]

function renderSelector(selectedKey: Fruit = FRUIT.Apple) {
  const onChange = vi.fn()
  render(
    <SegmentedControl
      ariaLabel={GROUP_LABEL}
      onChange={onChange}
      options={OPTIONS}
      selectedKey={selectedKey}
    />,
  )
  return { onChange }
}

describe("SegmentedControl", () => {
  it("names the group for assistive technology", () => {
    renderSelector()

    expect(screen.getByRole("radiogroup", { name: GROUP_LABEL })).toBeInTheDocument()
  })

  it("renders one option per choice", () => {
    renderSelector()

    expect(screen.getAllByRole("radio")).toHaveLength(OPTIONS.length)
  })

  it("marks only the selected choice as checked and focusable", () => {
    renderSelector(FRUIT.Banana)
    const checked = screen.getByRole("radio", { checked: true })

    expect(checked).toHaveTextContent("fruit.banana")
    expect(checked).toHaveAttribute("tabindex", "0")
    expect(screen.getByRole("radio", { name: "fruit.apple" })).toHaveAttribute("tabindex", "-1")
  })

  it("offers the short label of a choice next to the full one for small screens", () => {
    renderSelector()
    const option = screen.getByRole("radio", { name: "fruit.banana" })

    expect(option).toHaveTextContent("fruit.bananaShort")
    expect(option.querySelector(".sm\\:hidden")).toHaveTextContent("fruit.bananaShort")
    expect(option.querySelector(".sm\\:inline")).toHaveTextContent("fruit.banana")
  })

  it("shows only the full label of a choice without a short one", () => {
    renderSelector()

    expect(
      screen.getByRole("radio", { name: "fruit.apple" }).querySelectorAll("span"),
    ).toHaveLength(1)
  })

  it("reports the choice that is clicked", () => {
    const { onChange } = renderSelector()

    fireEvent.click(screen.getByRole("radio", { name: "fruit.cherry" }))

    expect(onChange).toHaveBeenCalledWith(FRUIT.Cherry)
  })

  it("moves to the next choice with the arrow key and focuses it", () => {
    const { onChange } = renderSelector()

    fireEvent.keyDown(screen.getByRole("radio", { checked: true }), { key: NEXT_OPTION_KEY })

    expect(onChange).toHaveBeenCalledWith(FRUIT.Banana)
    expect(screen.getByRole("radio", { name: "fruit.banana" })).toHaveFocus()
  })

  it("wraps around from the first choice to the last", () => {
    const { onChange } = renderSelector()

    fireEvent.keyDown(screen.getByRole("radio", { checked: true }), { key: PREVIOUS_OPTION_KEY })

    expect(onChange).toHaveBeenCalledWith(FRUIT.Cherry)
  })

  it("jumps to the first choice with Home", () => {
    const { onChange } = renderSelector(FRUIT.Cherry)

    fireEvent.keyDown(screen.getByRole("radio", { checked: true }), { key: FIRST_OPTION_KEY })

    expect(onChange).toHaveBeenCalledWith(FRUIT.Apple)
  })

  it("ignores keys that do not move the selection", () => {
    const { onChange } = renderSelector()

    fireEvent.keyDown(screen.getByRole("radio", { checked: true }), { key: "a" })

    expect(onChange).not.toHaveBeenCalled()
  })

  it("works as tabs that point at their panels", () => {
    render(
      <SegmentedControl
        ariaLabel={GROUP_LABEL}
        mode={SEGMENTED_CONTROL_MODE.Tabs}
        onChange={vi.fn()}
        options={OPTIONS}
        optionId={(key) => `tab-${key}`}
        panelId={(key) => `panel-${key}`}
        selectedKey={FRUIT.Banana}
      />,
    )
    const selected = screen.getByRole("tab", { selected: true })

    expect(screen.getByRole("tablist", { name: GROUP_LABEL })).toBeInTheDocument()
    expect(selected).toHaveAttribute("id", "tab-banana")
    expect(selected).toHaveAttribute("aria-controls", "panel-banana")
  })

  it("renders a choice without an icon", () => {
    render(
      <SegmentedControl
        ariaLabel={GROUP_LABEL}
        onChange={vi.fn()}
        options={[{ key: FRUIT.Apple, labelKey: "fruit.apple" }]}
        selectedKey={FRUIT.Apple}
      />,
    )

    expect(screen.getByRole("radio", { name: "fruit.apple" }).querySelector("svg")).toBeNull()
  })
})
