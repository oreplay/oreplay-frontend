const MIN_ORDER_DIGITS = 2

export function formatStageOrderTitle(stageOrder: number, description: string): string {
  return `${String(stageOrder).padStart(MIN_ORDER_DIGITS, "0")} - ${description}`
}
