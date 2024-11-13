import React from "react";
import {Box} from "@mui/material";

interface ResultListItemProps {
  children: React.ReactNode
}

const ResultListItem: React.FC<ResultListItemProps> = ({children,}) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      sx={{ flexDirection: 'row' }}
    >
      {children}
    </Box>
  )
}

export default ResultListItem