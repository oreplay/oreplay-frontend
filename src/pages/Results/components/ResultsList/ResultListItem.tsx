import { Box } from "@mui/material"
import { ReactNode } from "react"

interface ResultListItemProps {
  children: ReactNode
  onClick?: () => void
}

export default function ResultListItem({ children, onClick }: ResultListItemProps) {
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      sx={{
        flexDirection: "row",
        borderBottom: "1px solid #f2f2f2",
        marginY: "0 !important",
        paddingY: ".8em",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#fffbf0",
        },
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}
