import {Box} from "@mui/material";
import React from "react";

interface ControlBadgeProps {
  number: bigint | number;
  punched?: boolean;
}

const ControlBadge: React.FC<ControlBadgeProps> = ({ number, punched = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,           // Circle diameter
        height: 36,          // Circle diameter
        borderRadius: '50%', // Makes it a circle
        backgroundColor: punched ? 'primary.main' : 'gray',
        color: 'white',
        fontSize: '16px'
      }}
    >
      {number.toString()}
    </Box>
  );
};

export default ControlBadge;