import { Box, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

interface FlexRowProps {
  children: ReactNode;
  sx?: SxProps<Theme>; // Optional sx prop
}

const FlexRow: React.FC<FlexRowProps> = ({ children, sx }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        ...sx, // Apply the custom sx styles
      }}
    >
      {children}
    </Box>
  );
};

export default FlexRow;
