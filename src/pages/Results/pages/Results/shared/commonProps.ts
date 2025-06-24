import { UseQueryResult } from "react-query"
import { ClubModel, StageClassModel } from "../../../../../shared/EntityTypes.ts"

export type ResultsPageProps<TData, TError> = {
  runnersQuery: UseQueryResult<TData, TError>
  activeItem: StageClassModel | ClubModel | null
  isClass: boolean
}
