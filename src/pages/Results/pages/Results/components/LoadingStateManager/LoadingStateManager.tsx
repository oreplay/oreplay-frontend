import { UseQueryResult } from "react-query"
import React from "react"
import ChooseClassMsg from "../ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../components/GeneralErrorFallback.tsx"

interface LoadingStateManagerProps<TData, TError> {
  skeleton: React.ReactNode
  children: React.ReactNode
  query: UseQueryResult<TData, TError>
  isActiveItem: boolean
}

export default function LoadingStateManager<TData, TError>({
  skeleton,
  children,
  query,
  isActiveItem,
}: LoadingStateManagerProps<TData, TError>) {
  if (!isActiveItem) {
    return <ChooseClassMsg />
  }

  if (query.isLoading) {
    return skeleton
  }

  if (query.isRefetchError) {
    console.error("Refetch error:", query.error)
  }

  if (query.isError) {
    return <GeneralErrorFallback />
  }

  return <>{children}</>
}
