import { describe, expect, it } from "vitest"
import {
  initStageOrderForm,
  isOriginalFieldEditable,
  isStageOrderFormComplete,
  nextStageOrderNumber,
  toPatchBody,
  toPostBody,
} from "./stageOrderForm.ts"
import { StageOrderManagement } from "../../../../../../../domain/types/v1api"

const entity: StageOrderManagement = {
  created: "2026-01-01T00:00:00+00:00",
  description: "Prologue",
  id: "so-1",
  is_official: true,
  original_event_id: "evt-9",
  original_stage_id: "stg-3",
  stage_order: 2,
  start: "2026-05-01T08:30:00+00:00",
}

describe("initStageOrderForm", () => {
  it("returns empty defaults with no entity", () => {
    expect(initStageOrderForm()).toEqual({
      description: "",
      start: "",
      isOfficial: false,
      stageOrder: null,
      originalEventId: null,
      originalStageId: null,
    })
  })

  it("uses the provided default stage order when creating", () => {
    expect(initStageOrderForm(undefined, 3).stageOrder).toBe(3)
  })

  it("maps an entity, treating empty original ids as null", () => {
    expect(initStageOrderForm(entity)).toEqual({
      description: "Prologue",
      start: "2026-05-01T08:30:00+00:00",
      isOfficial: true,
      stageOrder: 2,
      originalEventId: "evt-9",
      originalStageId: "stg-3",
    })
    expect(initStageOrderForm({ ...entity, original_event_id: "" }).originalEventId).toBeNull()
  })
})

describe("toPostBody / toPatchBody", () => {
  it("builds a post body including stage_order", () => {
    const state = initStageOrderForm(entity)
    expect(toPostBody(state)).toEqual({
      description: "Prologue",
      is_official: true,
      original_event_id: "evt-9",
      original_stage_id: "stg-3",
      stage_order: 2,
      start: "2026-05-01T08:30:00+00:00",
    })
  })

  it("builds a patch body without stage_order", () => {
    const body = toPatchBody(initStageOrderForm(entity))
    expect(body).toEqual({
      description: "Prologue",
      is_official: true,
      original_event_id: "evt-9",
      original_stage_id: "stg-3",
      start: "2026-05-01T08:30:00+00:00",
    })
    expect("stage_order" in body).toBe(false)
  })

  it("omits null original ids and empty start", () => {
    const body = toPostBody(initStageOrderForm())
    expect(body.original_event_id).toBeUndefined()
    expect(body.original_stage_id).toBeUndefined()
    expect(body.start).toBeUndefined()
  })
})

describe("isStageOrderFormComplete", () => {
  it("requires description and start in edit mode", () => {
    const state = initStageOrderForm(entity)
    expect(isStageOrderFormComplete(state, "edit")).toBe(true)
    expect(isStageOrderFormComplete({ ...state, description: "  " }, "edit")).toBe(false)
    expect(isStageOrderFormComplete({ ...state, start: "" }, "edit")).toBe(false)
  })

  it("additionally requires stage_order and original ids in create mode", () => {
    const state = initStageOrderForm(entity)
    expect(isStageOrderFormComplete(state, "create")).toBe(true)
    expect(isStageOrderFormComplete({ ...state, stageOrder: null }, "create")).toBe(false)
    expect(isStageOrderFormComplete({ ...state, originalEventId: null }, "create")).toBe(false)
    expect(isStageOrderFormComplete({ ...state, originalStageId: null }, "create")).toBe(false)
  })
})

describe("isOriginalFieldEditable", () => {
  it("is editable only when the value is empty", () => {
    expect(isOriginalFieldEditable(null)).toBe(true)
    expect(isOriginalFieldEditable("")).toBe(true)
    expect(isOriginalFieldEditable("evt-9")).toBe(false)
  })
})

describe("nextStageOrderNumber", () => {
  it("is 1 for a ranking without stage orders", () => {
    expect(nextStageOrderNumber([])).toBe(1)
  })

  it("follows the highest number even when deletions left gaps", () => {
    expect(nextStageOrderNumber([{ stage_order: 1 }, { stage_order: 4 }, { stage_order: 2 }])).toBe(
      5,
    )
  })
})
