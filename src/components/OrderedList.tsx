import React, { ReactElement } from "react"
import { Box, SxProps, Theme, ListItemProps, useTheme } from "@mui/material"

// Extend ListItemProps to include the sx property
interface ListItemWithSx extends ListItemProps {
  sx?: SxProps<Theme>
}

interface OrderedListProps {
  children: ReactElement<ListItemWithSx>[] // Accepts only ListItem elements
  sx?: SxProps<Theme> // Optional styles for the <ol>
}

const OrderedList: React.FC<OrderedListProps> = ({ children, sx }) => {
  const theme = useTheme() // Access the Material-UI theme

  return (
    <Box
      component="ol"
      sx={{
        pl: "2.5em", // Left padding for indentation
        listStyleType: "decimal",
        color: theme.palette.text.primary, // Use theme color
        ...theme.typography.body1, // Spread all typography properties from body1
        ...sx, // Allow additional custom styles
      }}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          sx: {
            display: "list-item", // Ensure it behaves as a native <li>
            paddingLeft: 0, // Remove default ListItem padding
            ...theme.typography.body1, // Apply typography styles to ListItems
            ...child.props.sx, // Merge custom child styles
          },
        }),
      )}
    </Box>
  )
}

export default OrderedList
