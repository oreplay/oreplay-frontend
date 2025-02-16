import { Box } from "@mui/material";
import { ReactNode } from "react";

interface FlexRowProps {
  children: ReactNode;
}

const FlexRow: React.FC<FlexRowProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between"
      }}
    >
      {children}
    </Box>
  );
};

export default FlexRow;
