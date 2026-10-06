import { describe, expect, it } from "vitest"
import { uploadBoxFrameOf } from "./uploadBoxFrame.ts"

describe("uploadBoxFrameOf", () => {
  it("is a dashed neutral frame while waiting for files", () => {
    expect(uploadBoxFrameOf(false)).toEqual({
      borderColor: "divider",
      borderStyle: "dashed",
      isTinted: false,
    })
  })

  it("is highlighted while files are dragged over it", () => {
    expect(uploadBoxFrameOf(true)).toEqual({
      borderColor: "primary.main",
      borderStyle: "dashed",
      isTinted: true,
    })
  })

  it("is a solid frame in the colour of the result severity", () => {
    expect(uploadBoxFrameOf(false, "error")).toEqual({
      borderColor: "error.light",
      borderStyle: "solid",
      isTinted: false,
    })
  })
})
