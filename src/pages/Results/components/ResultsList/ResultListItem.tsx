import React from "react";
import { Box } from "@mui/material";

interface ResultListItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ResultListItem: React.FC<ResultListItemProps> = ({ children, onClick }) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      sx={{
        flexDirection: "row",
        borderBottom: "1px solid #f2f2f2",
        marginY: "0 !important",
        paddingY: ".8em",
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

export default ResultListItem;
