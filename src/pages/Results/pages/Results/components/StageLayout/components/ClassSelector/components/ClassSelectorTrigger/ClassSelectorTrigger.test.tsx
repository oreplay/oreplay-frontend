import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useIsMobileDevice } from "../../../../../../shared/useIsMobileDevice.ts"
import ClassSelectorTrigger from "./ClassSelectorTrigger.tsx"

vi.mock("../../../../../../shared/useIsMobileDevice.ts", () => ({
  useIsMobileDevice: vi.fn(),
}))

const ACTIVE_NAME = "M-21E"

describe("ClassSelectorTrigger", () => {
  const onClick = vi.fn()

  beforeEach(() => {
    onClick.mockClear()
  })

  it("renders a floating button with the active name on a mobile device", () => {
    vi.mocked(useIsMobileDevice).mockReturnValue(true)
    render(<ClassSelectorTrigger activeName={ACTIVE_NAME} isClass onClick={onClick} />)

    fireEvent.click(screen.getByRole("button", { name: ACTIVE_NAME }))

    expect(screen.queryByRole("textbox")).toBeNull()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("keeps the read-only input on desktop", () => {
    vi.mocked(useIsMobileDevice).mockReturnValue(false)
    render(<ClassSelectorTrigger activeName={ACTIVE_NAME} isClass onClick={onClick} />)

    fireEvent.click(screen.getByDisplayValue(ACTIVE_NAME))

    expect(screen.queryByRole("button")).toBeNull()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
