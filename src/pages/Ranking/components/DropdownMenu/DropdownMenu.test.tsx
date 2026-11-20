import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"
import DropdownMenu from "./DropdownMenu.tsx"

const VIEWPORT_HEIGHT = 800
const MENU_HEIGHT = 200
const TRIGGER_HEIGHT = 20

const placeTriggerAt = (top: number) => {
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(VIEWPORT_HEIGHT)
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const height = this.getAttribute("role") === "menu" ? MENU_HEIGHT : TRIGGER_HEIGHT
    return { top, bottom: top + height, height } as DOMRect
  })
}

const openMenu = () => {
  render(
    <MemoryRouter>
      <DropdownMenu
        triggerLabel="Options"
        trigger={<span aria-hidden="true" />}
        items={[{ label: "Edit", onSelect: vi.fn() }]}
      />
    </MemoryRouter>,
  )
  fireEvent.click(screen.getByRole("button", { name: "Options" }))
  return screen.getByRole("menu")
}

describe("DropdownMenu", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("opens below the trigger when there is room under it", () => {
    placeTriggerAt(100)
    expect(openMenu()).toHaveClass("top-full")
  })

  it("opens above the trigger near the bottom of the viewport", () => {
    placeTriggerAt(VIEWPORT_HEIGHT - TRIGGER_HEIGHT - 10)
    expect(openMenu()).toHaveClass("bottom-full")
  })
})
