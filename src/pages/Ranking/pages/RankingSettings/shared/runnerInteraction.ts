export const RUNNER_EXPANDED = "RUNNER_EXPANDED"
export const USER_INTERACTION_CHANNEL = "user_interaction"

const COMPETITION_PATH_SEPARATOR = "/competitions/"

export interface Runner {
  id: string
  full_name?: string
  bib_number?: string | number
}

export interface UserInteraction {
  type?: string
  path?: string
  payload?: Runner
}

export interface RunnerInteraction {
  eventId: string
  stageId: string
  runner: Runner | null
}

export function runnerLabel(runner: Runner): string {
  return `${runner.bib_number}: ${runner.full_name}`
}

export function toRunnerInteraction(data: UserInteraction | null): RunnerInteraction | null {
  if (data?.type !== RUNNER_EXPANDED || !data.path) return null
  const [eventId, stageId] = data.path.split(COMPETITION_PATH_SEPARATOR)[1]?.split("/") ?? []
  if (!eventId || !stageId) return null
  return {
    eventId,
    stageId,
    runner: data.payload?.full_name ? data.payload : null,
  }
}
