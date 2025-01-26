import {
  OrganizerModel,
  Page,
} from "../../../shared/EntityTypes.ts"
import { deleteRequest, get, patch, post } from "../../../services/ApiConfig.ts"
const baseUrl = "api/v1/organizers"

export async function getOrganizerList(
  search?: string | null
): Promise<Page<OrganizerModel>> {
  const searchParams = new URLSearchParams()

  // set different search params
  if (search) {
    searchParams.set("search", search.toString())
  }

  // return query
  return await get<Page<OrganizerModel>>(`${baseUrl}?${searchParams.toString()}`)
}
