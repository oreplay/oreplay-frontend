type TableRow = {
  M: number
  F: number
  total: number
}

export type StatsTable = Record<string, TableRow>

export interface ProcessedStats {
  table1: StatsTable
  table2: StatsTable
}
