import { describe, expect, it } from "vitest"
import { initialSelection, moveClass, toFedoStatsParams } from "./categorySelection.ts"

describe("initialSelection", () => {
  it("assigns each class to its first matching bucket, the rest to others", () => {
    expect(initialSelection(["M-12", "F-21A", "M-40", "F-14", "H-99", "U-10"])).toEqual({
      sub20M: ["M-12", "U-10"],
      sub20F: ["F-14"],
      seniorM: ["M-40"],
      seniorF: ["F-21A"],
      others: ["H-99"],
    })
  })

  it("assigns the open and 21 senior classes to their gendered senior bucket", () => {
    expect(initialSelection(["S", "M-S", "M-21", "F-S", "F-21"])).toEqual({
      sub20M: [],
      sub20F: [],
      seniorM: ["S", "M-S", "M-21"],
      seniorF: ["F-S", "F-21"],
      others: [],
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
      others: ["OPEN"],
    }
    expect(moveClass(selection, "M-12", "others")).toEqual({
      sub20M: ["M-14"],
      sub20F: [],
      seniorM: [],
      seniorF: [],
      others: ["OPEN", "M-12"],
    })
  })
})

describe("toFedoStatsParams", () => {
  it("joins each official bucket's class names and ignores others", () => {
    expect(
      toFedoStatsParams({
        sub20M: ["M-12", "M-14"],
        sub20F: ["F-14"],
        seniorM: ["M-40"],
        seniorF: [],
        others: ["OPEN"],
      }),
    ).toEqual({
      officialSub20M: "M-12,M-14",
      officialSub20F: "F-14",
      officialSeniorM: "M-40",
      officialSeniorF: "",
    })
  })
})
