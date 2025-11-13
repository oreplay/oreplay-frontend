import { ReactNode } from "react"
import NowProvider from "../../../../../components/NowProvider.tsx"
import { motion } from "framer-motion"

interface RelayResultContainerProps {
  children?: ReactNode
}

export default function RelayResultContainer({ children }: RelayResultContainerProps) {
  return (
    <NowProvider>
      <motion.table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</motion.table>
    </NowProvider>
  )
}
