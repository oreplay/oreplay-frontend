import { motion } from "framer-motion"
import { ReactNode } from "react"
import "./styles.css"

interface ResultListItemProps {
  children: ReactNode
  onClick?: () => void
}

export default function ResultListItem({ children, onClick }: ResultListItemProps) {
  return (
    <motion.div
      layout
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.8,
        //delay: index * 0.025, // subtle stagger for natural motion // TODO: Find a way of delaying without unnecesary re-rendering
      }}
      onClick={onClick}
      className={`result-list-item ${onClick ? "clickable" : ""}`}
    >
      {children}
    </motion.div>
  )
}
