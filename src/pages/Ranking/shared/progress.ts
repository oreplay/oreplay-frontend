export interface Progress {
  completed: number
  total: number
}

export type ProgressReporter = (completed: number, total: number) => void
