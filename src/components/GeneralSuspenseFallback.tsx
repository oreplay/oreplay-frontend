import loadingIcon from "../assets/loading.svg"
import Box from "@mui/material/Box"
import { useTranslation } from "react-i18next"

type GeneralSuspenseFallbackProps = {
  useViewPort?: boolean
}

export default function GeneralSuspenseFallback(props: GeneralSuspenseFallbackProps) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        width: props.useViewPort ? "100vw" : "100%",
        height: props.useViewPort ? "100vh" : "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img alt={t("Loading")} height={50} width={50} src={loadingIcon}></img>
    </Box>
  )
}
