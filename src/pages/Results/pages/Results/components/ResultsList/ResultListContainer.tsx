import { ReactNode, FC } from "react"
import NowProvider from "../NowProvider.tsx"
import { AnimatePresence, motion } from "framer-motion"

interface ResultListContainerProps {
  children: ReactNode
}

const ResultListContainer: FC<ResultListContainerProps> = ({
  children,
}: ResultListContainerProps) => {
  return (
    <NowProvider>
      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <AnimatePresence>
          {children}
        </AnimatePresence>
      </motion.div>
    </NowProvider>
  )
}

export default ResultListContainer
