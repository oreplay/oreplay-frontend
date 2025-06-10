import React from "react"

type TextProps = {
  children: React.ReactNode
  className?: string
}

export const Text: React.FC<TextProps> = ({ children, className = "" }) => {
  return <p className={className}>{children}</p>
}
