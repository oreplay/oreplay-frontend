import { Participant } from "../../../../../domain/types/v1api"

export interface ExportRunner {
  fullname: string
  class: string
  club: string | null
  participants: string[] | null
  sex: string | null
  position: number
}

export interface RankedParticipant {
  participant: Participant
  position: number
}

export interface ClassResults {
  className: string
  participants: Participant[]
}

export function participantPosition(participant: Participant): number | null {
  return participant.overalls?.overall?.position ?? participant.stage?.position ?? null
}

export function topParticipantsInClass(
  participants: Participant[],
  topCount: number,
): RankedParticipant[] {
  return participants
    .filter((participant) => !participant.is_nc)
    .map((participant) => ({ participant, position: participantPosition(participant) }))
    .filter(
      (ranked): ranked is RankedParticipant =>
        ranked.position !== null && ranked.position <= topCount,
    )
    .sort((a, b) => a.position - b.position)
}

export function toExportRunner(ranked: RankedParticipant, className: string): ExportRunner {
  const { participant } = ranked
  return {
    fullname: participant.full_name,
    class: className,
    club: participant.club?.short_name ?? null,
    participants: participant.runners?.map((runner) => runner.full_name) ?? null,
    sex: participant.sex ?? null,
    position: ranked.position,
  }
}

export function buildExportRunners(classResults: ClassResults[], topCount: number): ExportRunner[] {
  return classResults.flatMap((classResult) =>
    topParticipantsInClass(classResult.participants, topCount).map((ranked) =>
      toExportRunner(ranked, classResult.className),
    ),
  )
}
