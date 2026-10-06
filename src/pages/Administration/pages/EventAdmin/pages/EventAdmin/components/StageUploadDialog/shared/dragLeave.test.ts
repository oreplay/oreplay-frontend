import { describe, expect, it } from "vitest"
import { isLeavingArea } from "./dragLeave.ts"

const buildArea = () => {
  const area = document.createElement("div")
  const child = document.createElement("span")
  area.appendChild(child)
  return { area, child }
}

describe("isLeavingArea", () => {
  it("stays inside when the pointer moves onto a child", () => {
    const { area, child } = buildArea()

    expect(isLeavingArea(area, child)).toBe(false)
  })

  it("stays inside when the pointer comes back from a child to the area", () => {
    const { area } = buildArea()

    expect(isLeavingArea(area, area)).toBe(false)
  })

  it("leaves when the pointer moves onto an outside element", () => {
    const { area } = buildArea()

    expect(isLeavingArea(area, document.createElement("div"))).toBe(true)
  })

  it("leaves when the pointer goes out of the window", () => {
    const { area } = buildArea()

    expect(isLeavingArea(area, null)).toBe(true)
  })
})
