export const STAGE_ORDER_ACTIONS = [
  { key: "edit", labelKey: "common:edit" },
  { key: "organizers", labelKey: "StageOrders.manageOrganizers" },
  { key: "process", labelKey: "StageOrders.processResults" },
  { key: "export", labelKey: "StageOrders.export" },
  { key: "stats", labelKey: "StageOrders.stats" },
] as const

export type StageOrderAction = (typeof STAGE_ORDER_ACTIONS)[number]["key"]

export const SOURCE_STAGE_ACTIONS = ["process", "export", "stats"] as const
export type SourceStageAction = (typeof SOURCE_STAGE_ACTIONS)[number]

export const isSourceStageAction = (action: StageOrderAction): action is SourceStageAction =>
  (SOURCE_STAGE_ACTIONS as readonly string[]).includes(action)
