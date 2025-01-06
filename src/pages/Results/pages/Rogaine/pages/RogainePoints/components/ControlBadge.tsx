import { Box } from "@mui/material";
import React from "react";

interface ControlBadgeProps {
  number: bigint | number;
  punched?: boolean;
}

const ControlBadge: React.FC<ControlBadgeProps> = ({ number, punched = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32, // Circle diameter
        height: 32, // Circle diameter
        borderRadius: "50%", // Makes it a circle,
        borderColor: punched ? undefined : "text.secondary",
        border: punched ? 0 : 1,
        backgroundColor: punched ? "secondary.main" : undefined,
        color: punched ? "white" : "text.secondary",
      }}
    >
      {number.toString()}
    </Box>
  );
};

export default ControlBadge;
