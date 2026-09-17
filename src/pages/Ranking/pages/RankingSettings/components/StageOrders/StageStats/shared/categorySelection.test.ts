import { describe, expect, it } from "vitest"
import { initialSelection, moveClass, toFedoStatsParams } from "./categorySelection.ts"

describe("initialSelection", () => {
  it("assigns each class to its first matching bucket, others to excluded", () => {
    expect(initialSelection(["M-12", "F-21A", "M-40", "F-14", "H-99", "U-10"])).toEqual({
      sub20M: ["M-12", "U-10"],
      sub20F: ["F-14"],
      seniorM: ["M-40"],
      seniorF: ["F-21A"],
      excluded: ["H-99"],
    })
  })
})

describe("moveClass", () => {
  it("removes the class from its current bucket and appends it to the target", () => {
    const selection = {
      sub20M: ["M-12", "M-14"],
      sub20F: [],
      seniorM: [],
      seniorF: [],
      excluded: ["OPEN"],
    }
    expect(moveClass(selection, "M-12", "excluded")).toEqual({
      sub20M: ["M-14"],
      sub20F: [],
      seniorM: [],
      seniorF: [],
      excluded: ["OPEN", "M-12"],
    })
  })
})

describe("toFedoStatsParams", () => {
  it("joins each official bucket's class names and ignores excluded", () => {
    expect(
      toFedoStatsParams({
        sub20M: ["M-12", "M-14"],
        sub20F: ["F-14"],
        seniorM: ["M-40"],
        seniorF: [],
        excluded: ["OPEN"],
      }),
    ).toEqual({
      officialSub20M: "M-12,M-14",
      officialSub20F: "F-14",
      officialSeniorM: "M-40",
      officialSeniorF: "",
    })
  })
})
