import { ReactNode } from "react"

interface RelayResultLegTimeProps {
  children: ReactNode
}

/**
 * Time column of a relay leg: right-aligned, with tabular digits and a minimum width that fits
 * an `h:mm:ss` time, so the columns of every leg of every team stay aligned. Only a longer label
 * (a live time in brackets, "not started") widens it.
 *
 * @param props.children The time or status to show.
 */
export default function RelayResultLegTime({ children }: RelayResultLegTimeProps) {
  return <div className="min-w-[4.5rem] whitespace-nowrap text-right tabular-nums">{children}</div>
}
