import { Participant, RankingOrganizer } from "../../../../../domain/types/v1api"

export const ORGANIZER_RANKING_STATUSES = ["addable", "checking", "inStage", "missing"] as const
export type OrganizerRankingStatus = (typeof ORGANIZER_RANKING_STATUSES)[number]

export interface OrganizerRankingStatusInput {
  runnerId?: string | null
  participants: Participant[]
  isChecking: boolean
  stageOrder?: number
}

export function findRunnerParticipant(
  participants: Participant[],
  runnerId: string,
): Participant | undefined {
  return participants.find((candidate) => candidate.id === runnerId)
}

export function hasResultInStageOrder(participant: Participant, stageOrder: number): boolean {
  return (participant.overalls?.parts ?? []).some((part) => part.stage_order === stageOrder)
}

const REMOVABLE_ORGANIZER_STATUSES: readonly OrganizerRankingStatus[] = ["addable", "missing"]

export function isOrganizerRemovable(status: OrganizerRankingStatus): boolean {
  return REMOVABLE_ORGANIZER_STATUSES.includes(status)
}

export function organizerRankingStatus({
  runnerId,
  participants,
  isChecking,
  stageOrder,
}: OrganizerRankingStatusInput): OrganizerRankingStatus {
  if (!runnerId) return "missing"
  if (isChecking || stageOrder === undefined) return "checking"
  const participant = findRunnerParticipant(participants, runnerId)
  if (!participant) return "missing"
  return hasResultInStageOrder(participant, stageOrder) ? "inStage" : "addable"
}

export function organizerSearchText(
  organizer: Pick<RankingOrganizer, "first_name" | "last_name">,
): string {
  return organizer.last_name.trim() || organizer.first_name.trim()
}
