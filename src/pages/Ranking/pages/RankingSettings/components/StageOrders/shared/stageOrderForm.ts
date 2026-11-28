import {
  PatchStageOrdersBody,
  PostStageOrdersBody,
  StageOrderManagement,
} from "../../../../../../../domain/types/v1api"

export const STAGE_ORDER_DEFAULT_START_TIME = "09:00"

export const STAGE_ORDER_DIALOG_MODES = ["create", "edit"] as const
export type StageOrderDialogMode = (typeof STAGE_ORDER_DIALOG_MODES)[number]

export interface StageOrderFormState {
  description: string
  start: string
  isOfficial: boolean
  stageOrder: number | null
  originalEventId: string | null
  originalStageId: string | null
}

export function isOriginalFieldEditable(value: string | null): boolean {
  return !value
}

export function initStageOrderForm(
  stageOrder?: StageOrderManagement,
  defaultStageOrder: number | null = null,
): StageOrderFormState {
  if (!stageOrder) {
    return {
      description: "",
      start: "",
      isOfficial: false,
      stageOrder: defaultStageOrder,
      originalEventId: null,
      originalStageId: null,
    }
  }
  return {
    description: stageOrder.description,
    start: stageOrder.start,
    isOfficial: stageOrder.is_official,
    stageOrder: stageOrder.stage_order,
    originalEventId: stageOrder.original_event_id || null,
    originalStageId: stageOrder.original_stage_id || null,
  }
}

export function toPostBody(state: StageOrderFormState): PostStageOrdersBody {
  return {
    description: state.description,
    is_official: state.isOfficial,
    original_event_id: state.originalEventId ?? undefined,
    original_stage_id: state.originalStageId ?? undefined,
    stage_order: state.stageOrder ?? undefined,
    start: state.start || undefined,
  }
}

export function toPatchBody(state: StageOrderFormState): PatchStageOrdersBody {
  return {
    description: state.description,
    is_official: state.isOfficial,
    original_event_id: state.originalEventId ?? undefined,
    original_stage_id: state.originalStageId ?? undefined,
    start: state.start || undefined,
  }
}

export function isStageOrderFormComplete(
  state: StageOrderFormState,
  mode: StageOrderDialogMode,
): boolean {
  if (!state.description.trim()) return false
  if (!state.start) return false
  if (mode === "create") {
    if (state.stageOrder === null) return false
    if (!state.originalEventId) return false
    if (!state.originalStageId) return false
  }
  return true
}

/**
 * Suggests the number of a new stage order: one past the highest existing number, so it never
 * repeats one even when deletions left gaps.
 * @param stageOrders - the ranking's current stage orders, in any order; empty for a new ranking
 * @returns the highest `stage_order` plus one, or 1 when there are none
 */
export function nextStageOrderNumber(
  stageOrders: Pick<StageOrderManagement, "stage_order">[],
): number {
  return Math.max(0, ...stageOrders.map((stageOrder) => stageOrder.stage_order)) + 1
}
