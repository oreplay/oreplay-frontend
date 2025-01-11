import React, { ReactElement } from "react"
import { Box, SxProps, Theme, ListItemProps } from "@mui/material"

// Extend ListItemProps to include the sx property
interface ListItemWithSx extends ListItemProps {
  sx?: SxProps<Theme>
}

interface OrderedListProps {
  children: ReactElement<ListItemWithSx>[] // Accepts only ListItem elements
  sx?: SxProps<Theme> // Optional styles for the <ol>
}

const OrderedList: React.FC<OrderedListProps> = ({ children, sx }) => {
  return (
    <Box
      component="ol"
      sx={{
        pl: "3em", // Left padding for indentation
        listStyleType: "decimal",
        color: "text.primary",
        ...sx, // Allow additional custom styles
      }}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          sx: {
            display: "list-item", // Ensure it behaves as a native <li>
            paddingLeft: 0, // Remove default ListItem padding
            ...child.props.sx, // Merge custom child styles
          },
        }),
      )}
    </Box>
  )
}

export default OrderedList
