import { PostListRankingOrganizersBody } from "../../../../../domain/types/v1api"

export interface RankingOrganizerFormState {
  firstName: string
  lastName: string
  description: string
}

export const EMPTY_RANKING_ORGANIZER_FORM: RankingOrganizerFormState = {
  firstName: "",
  lastName: "",
  description: "",
}

export function toPostBody(state: RankingOrganizerFormState): PostListRankingOrganizersBody {
  return {
    first_name: state.firstName.trim(),
    last_name: state.lastName.trim(),
    description: state.description.trim() || undefined,
  }
}

export function isRankingOrganizerFormComplete(state: RankingOrganizerFormState): boolean {
  return Boolean(state.firstName.trim() && state.lastName.trim())
}
