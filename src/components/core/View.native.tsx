import React from "react"
// @ts-expect-error Wrapper react native
import { View as RnView } from "react-native"

type ViewProps = {
  children: React.ReactNode
  className?: string
}

export const View: React.FC<ViewProps> = ({ children, className = "" }) => {
  return <RnView className={className}>{children}</RnView>
}
