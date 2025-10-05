import { Box, SxProps, Theme } from "@mui/material"
import { ReactNode } from "react"

interface FlexColProps {
  children: ReactNode
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline"
  width?: string | number
  flexGrow?: number // Optional flexGrow prop
  sx?: SxProps<Theme> // Optional sx prop
}

const FlexCol: React.FC<FlexColProps> = ({
  children,
  sx,
  alignItems = "flex-end",
  width,
  flexGrow,
}) => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        display: "flex", // Add this line to enable flex properties for the box
        flexDirection: "column", // Stack text vertically
        justifyContent: "flex-start", // Center the content vertically in the box
        alignItems: alignItems, // Align the content horizontally in the box
        ...(width ? { width } : { width: "10px" }), // Use prop if provided, else default
        ...(flexGrow !== undefined ? { flexGrow } : {}), // Apply flexGrow if provided
        ...sx, // Apply the custom sx styles
      }}
    >
      {children}
    </Box>
  )
}

export default FlexCol
