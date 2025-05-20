import { UseQueryResult } from "react-query"
import { ClassModel, ClubModel } from "../../../../../shared/EntityTypes.ts"

export type ResultsPageProps<TData, TError> = {
  runnersQuery: UseQueryResult<TData, TError>
  activeItem: ClassModel | ClubModel | null
  isClass: boolean
}
