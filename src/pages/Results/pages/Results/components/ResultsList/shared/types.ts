import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { FunctionComponent } from "react"
import { ResultColumnProps } from "../IndividualResult/IndividualResult.tsx"

/**
 *
 */
export interface ResultItemProps {
  runner: ProcessedRunnerModel
  isClass: boolean
  onClick?: (runner: ProcessedRunnerModel) => void
  ResultColumn: FunctionComponent<ResultColumnProps>
}
