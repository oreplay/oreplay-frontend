import { CSSProperties, ReactNode, useRef } from "react"
import useResultListHeight from "./shared/useResultListHeight.ts"

const DESKTOP_COLUMNS_CLASS_NAME = [
  "lg:h-[var(--result-list-height)]",
  "lg:columns-[360px]",
  "lg:gap-4",
  "lg:[column-fill:auto]",
  "lg:[column-rule:1px_solid_#e5e7eb]",
  "lg:overflow-x-auto",
  "lg:overflow-y-hidden",
  "lg:[scrollbar-color:#ff710a_#f2f2f2]",
  "lg:[scrollbar-width:auto]",
  "lg:[&::-webkit-scrollbar]:h-3",
  "lg:[&::-webkit-scrollbar-track]:bg-[#f2f2f2]",
  "lg:[&::-webkit-scrollbar-thumb]:rounded-full",
  "lg:[&::-webkit-scrollbar-thumb]:bg-[#ff710a]",
  "lg:[&>*]:break-inside-avoid",
].join(" ")

interface ResultListContainerProps {
  children?: ReactNode
}

export default function ResultListContainer({ children }: ResultListContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const height = useResultListHeight(containerRef)
  const style = { "--result-list-height": `${height}px` } as CSSProperties

  return (
    <div className={`w-full ${DESKTOP_COLUMNS_CLASS_NAME}`} ref={containerRef} style={style}>
      {children}
    </div>
  )
}
