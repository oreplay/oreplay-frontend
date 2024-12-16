import React from "react";
import {Box, Stack} from "@mui/material";

interface ResultListContainerProps {
  children: React.ReactNode
}

const ResultListContainer: React.FC<ResultListContainerProps> = ({children}) => {
  return (
    <Box sx={{height: "100%", marginBottom:'2rem',marginTop:'1em', maxWidth:'600px', width:'100%'}}>
      <Stack direction={"column"} spacing={2} sx={{flexWrap: 'wrap'}}>
        {children}
      </Stack>
    </Box>
  )
}

export default ResultListContainer;