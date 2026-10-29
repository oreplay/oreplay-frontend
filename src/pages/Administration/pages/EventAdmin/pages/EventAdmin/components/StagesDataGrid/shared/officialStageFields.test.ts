import { describe, expect, it } from "vitest"
import {
  getStageCellClassName,
  isStageFieldEditable,
  OFFICIAL_LOCKED_CELL_CLASS,
  OFFICIAL_LOCKED_STAGE_FIELDS,
} from "./officialStageFields.ts"

const NAME_FIELD = "stageName"

describe("isStageFieldEditable", () => {
  it.each(OFFICIAL_LOCKED_STAGE_FIELDS)("locks %s on an official stage", (field) => {
    expect(isStageFieldEditable(field, true)).toBe(false)
  })

  it.each(OFFICIAL_LOCKED_STAGE_FIELDS)("lets %s be edited on a provisional stage", (field) => {
    expect(isStageFieldEditable(field, false)).toBe(true)
  })

  it("keeps the name editable on an official stage", () => {
    expect(isStageFieldEditable(NAME_FIELD, true)).toBe(true)
  })
})

describe("getStageCellClassName", () => {
  it.each(OFFICIAL_LOCKED_STAGE_FIELDS)("greys out %s while editing an official stage", (field) => {
    expect(getStageCellClassName(field, true, true)).toBe(OFFICIAL_LOCKED_CELL_CLASS)
  })

  it.each(OFFICIAL_LOCKED_STAGE_FIELDS)("leaves %s as usual outside edit mode", (field) => {
    expect(getStageCellClassName(field, true, false)).toBe("")
  })

  it.each(OFFICIAL_LOCKED_STAGE_FIELDS)("leaves %s as usual on a provisional stage", (field) => {
    expect(getStageCellClassName(field, false, true)).toBe("")
  })

  it("leaves the name as usual while editing an official stage", () => {
    expect(getStageCellClassName(NAME_FIELD, true, true)).toBe("")
  })
})
