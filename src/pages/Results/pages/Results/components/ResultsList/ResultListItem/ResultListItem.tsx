import { Box } from "@mui/material"
import { ReactNode } from "react"

interface ResultListItemProps {
  children: ReactNode
  onClick?: () => void
}

export default function ResultListItem({ children, onClick }: ResultListItemProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #f2f2f2",
        flexDirection: "row",
        gap: 1,
        cursor: onClick ? "pointer" : undefined,
        "&:hover": {
          backgroundColor: onClick ? "#fffbf0" : undefined,
          borderRadius: onClick ? 2 : undefined,
        },
        paddingX: 0.5,
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}
