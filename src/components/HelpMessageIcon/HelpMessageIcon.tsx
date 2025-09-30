import { useState } from "react"
import Tooltip from "@mui/material/Tooltip"
import QuestionMarkIcon from "@mui/icons-material/QuestionMark"

interface HelpMessageIconProps {
  msg: string
}

export default function HelpMessageIcon({ msg }: HelpMessageIconProps) {
  const [open, setOpen] = useState(false)

  return (
    <Tooltip
      title={msg}
      arrow
      placement="top"
      disableHoverListener
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      sx={{ cursor: "pointer" }}
    >
      <QuestionMarkIcon fontSize="inherit" onClick={() => setOpen(!open)} />
    </Tooltip>
  )
}
