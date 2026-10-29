import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import OfficialOffIcon from "./OfficialOffIcon.tsx"

describe("OfficialOffIcon", () => {
  it("draws the seal and keeps the whole icon hidden from assistive technology", () => {
    const { container } = render(<OfficialOffIcon />)
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true")
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
