import loadingIcon from "../assets/loading.svg"
import Box from "@mui/material/Box"
import { useTranslation } from "react-i18next"

export default function GeneralSuspenseFallback() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img alt={t("Loading")} height={50} width={50} src={loadingIcon}></img>
    </Box>
  )
}
