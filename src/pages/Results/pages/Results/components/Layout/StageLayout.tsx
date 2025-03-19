import { Box, IconButton } from "@mui/material"
import ClassSelector from "./components/ClassSelector.tsx"
import Tooltip from "@mui/material/Tooltip"
import RefreshIcon from "@mui/icons-material/Refresh"
import { useTranslation } from "react-i18next"
import { ClassModel } from "../../../../../../shared/EntityTypes.ts"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import GeneralErrorFallback from "../../../../../../components/GeneralErrorFallback.tsx"
import NoDataInStageMsg from "../NoDataInStageMsg.tsx"

type StageLayoutProps = {
  handleRefreshClick: () => void
  classesList: ClassModel[]
  setActiveClassId: (newActiveClassId: string) => void
  activeClass: ClassModel | null
  areClassesLoading: boolean
  children: React.ReactNode
}

export default function StageLayout(props: StageLayoutProps) {
  const { t } = useTranslation()

  if (props.classesList.length === 0 && !props.areClassesLoading) {
    return <NoDataInStageMsg />
  }

  return (
    <Box
      sx={{
        height: "calc(100% - 64px)",
        padding: "24px 24px",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "600px",
        }}
      >
        <ClassSelector
          activeClass={props.activeClass}
          setActiveClassId={props.setActiveClassId}
          classesList={props.classesList}
          isLoading={props.areClassesLoading}
        />
        <Tooltip title={t("ResultsStage.Refresh")}>
          <IconButton onClick={props.handleRefreshClick}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ marginTop: "12px", flex: 1, paddingBottom: "56px" }}>
        <ErrorBoundary fallback={<GeneralErrorFallback displayMsg />}>
          {props.children}
        </ErrorBoundary>
      </Box>
    </Box>
  )
}
