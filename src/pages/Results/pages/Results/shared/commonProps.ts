import { UseQueryResult } from "react-query"
import { ClassModel } from "../../../../../shared/EntityTypes.ts"

export type ResultsPageProps<TData, TError> = {
  runnersQuery: UseQueryResult<TData, TError>
  activeClass: ClassModel | null
}
