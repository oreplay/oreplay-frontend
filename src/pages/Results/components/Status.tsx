import { RESULT_STATUS_TEXT } from "../shared/constants.ts"
import { Typography } from "@mui/material"
import React from "react"
import { useTranslation } from "react-i18next"

type StatusProps = {
  status: string
  style?: object
}

const Status: React.FC<StatusProps> = ({ status, style }) => {
  const { t } = useTranslation()

  let parsedStyle = {
    ...style,
  }

  switch (status) {
    case RESULT_STATUS_TEXT.mp:
      parsedStyle = {
        ...style,
        color: "red",
      }
      break

    default:
      break
  }
  return <Typography sx={parsedStyle}>{t(`ResultsStage.statusCodes.${status}`)}</Typography>
}

export default Status
