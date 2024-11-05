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
        width: 40,           // Circle diameter
        height: 40,          // Circle diameter
        borderRadius: '50%', // Makes it a circle
        backgroundColor: punched ? 'primary.main' : 'gray',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
    >
      {number.toString()}
    </Box>
  );
};

export default ControlBadge;