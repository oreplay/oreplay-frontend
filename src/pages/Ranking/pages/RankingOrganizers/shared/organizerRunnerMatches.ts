import {
  PostListRankingOrganizersBody,
  RankingOrganizer,
  RunnerSearch,
} from "../../../../../domain/types/v1api"
import { OrganizerRankingStatus } from "./organizerRankingStatus.ts"

export function needsRunnerMatches(status: OrganizerRankingStatus): boolean {
  return status === "missing"
}

export function toReplacementOrganizerBody(
  organizer: Pick<RankingOrganizer, "description">,
  runner: RunnerSearch,
): PostListRankingOrganizersBody {
  return {
    first_name: runner.first_name,
    last_name: runner.last_name,
    description: organizer.description || undefined,
    runner_id: runner.id,
  }
}
