import React from "react"
// @ts-expect-error Wrapper react native
import { Text as RnText } from "react-native"

type TextProps = {
  children: React.ReactNode
  className?: string
}

export const Text: React.FC<TextProps> = ({ children, className = "" }) => {
  return <RnText className={className}>{children}</RnText>
}
