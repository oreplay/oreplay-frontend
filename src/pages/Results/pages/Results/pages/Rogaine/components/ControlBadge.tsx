import { Box } from "@mui/material"
import React from "react"

interface ControlBadgeProps {
  number: bigint | number
  punched?: boolean
}

/**
 * Round badge with a control's station number, filled when the runner punched it.
 *
 * @param props.number Station number of the control.
 * @param props.punched Whether the runner punched the control; an outlined badge when not.
 */
const ControlBadge: React.FC<ControlBadgeProps> = ({ number, punched = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: "50%",
        borderColor: punched ? undefined : "text.secondary",
        border: punched ? 0 : 1,
        backgroundColor: punched ? "secondary.main" : undefined,
        color: punched ? "white" : "text.secondary",
      }}
    >
      {number.toString()}
    </Box>
  )
}

export default ControlBadge
