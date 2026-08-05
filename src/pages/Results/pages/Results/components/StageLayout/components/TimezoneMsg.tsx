import { useTranslation } from "react-i18next"
import { Alert, Collapse } from "@mui/material"
import { useState } from "react"

export default function TimezoneMsg() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)

  return (
    <Collapse in={open}>
      <Alert
        severity={"info"}
        onClose={() => {
          setOpen(false)
        }}
        sx={{
          margin: 2,
        }}
      >
        {t("TimezoneMismatchRunnerMsg")}
      </Alert>
    </Collapse>
  )
}
