import React from "react"

type ViewProps = {
  children?: React.ReactNode
  className?: string
}

export const View: React.FC<ViewProps> = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>
}
