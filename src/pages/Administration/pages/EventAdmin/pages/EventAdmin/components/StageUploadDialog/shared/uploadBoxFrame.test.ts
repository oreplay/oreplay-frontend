import { describe, expect, it } from "vitest"
import { uploadBoxFrameOf } from "./uploadBoxFrame.ts"

describe("uploadBoxFrameOf", () => {
  it("is a dashed neutral frame while waiting for files", () => {
    expect(uploadBoxFrameOf(false)).toEqual({
      backgroundColor: "transparent",
      borderColor: "divider",
      borderStyle: "dashed",
    })
  })

  it("is highlighted while files are dragged over it", () => {
    expect(uploadBoxFrameOf(true)).toEqual({
      backgroundColor: "action.hover",
      borderColor: "primary.main",
      borderStyle: "dashed",
    })
  })

  it("is a solid frame in the colour of the result severity", () => {
    expect(uploadBoxFrameOf(false, "error")).toEqual({
      backgroundColor: "transparent",
      borderColor: "error.light",
      borderStyle: "solid",
    })
  })
})
