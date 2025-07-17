import { Box, IconButton } from "@mui/material"
import ClassSelector from "./components/ClassSelector/ClassSelector.tsx"
import Tooltip from "@mui/material/Tooltip"
import RefreshIcon from "@mui/icons-material/Refresh"
import { useTranslation } from "react-i18next"
import { ClassModel, ClubModel, Page } from "../../../../../../shared/EntityTypes.ts"
import React from "react"
import { ErrorBoundary } from "@sentry/react"
import GeneralErrorFallback from "../../../../../../components/GeneralErrorFallback.tsx"
//import NoDataInStageMsg from "../NoDataInStageMsg.tsx"
import WrongResultsFileUploadedMsg from "../WrongResultsFileUploadedMsg.tsx"
import { UseQueryResult } from "react-query"

type StageLayoutProps = {
  handleRefreshClick: () => void
  isClass: boolean
  classesQuery: UseQueryResult<Page<ClassModel>>
  clubsQuery: UseQueryResult<Page<ClubModel>>
  setActiveClassClub: (newActiveClassId: string, isClass: boolean) => void
  activeItem: ClassModel | ClubModel | null
  isWrongFileUploaded?: boolean
  children: React.ReactNode
}

export default function StageLayout(props: StageLayoutProps) {
  const { t } = useTranslation()

  //if (props.classesList.length === 0 && !props.areClassesLoading) {
  //  return <NoDataInStageMsg />
  //}

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
      {props.isWrongFileUploaded ? <WrongResultsFileUploadedMsg /> : <></>}
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
          activeClassClub={props.activeItem}
          isClass={props.isClass}
          setActiveClassClubId={props.setActiveClassClub}
          classesQuery={props.classesQuery}
          clubsQuery={props.clubsQuery}
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
