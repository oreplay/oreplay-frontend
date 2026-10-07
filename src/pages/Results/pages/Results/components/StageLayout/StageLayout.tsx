import { Box, IconButton } from "@mui/material"
import ClassSelector from "./components/ClassSelector/ClassSelector.tsx"
import Tooltip from "@mui/material/Tooltip"
import RefreshIcon from "@mui/icons-material/Refresh"
import { useTranslation } from "react-i18next"
import { ClassModel, ClubModel, Page } from "../../../../../../shared/EntityTypes.ts"
import React from "react"
import WrongResultsFileUploadedMsg from "../WrongResultsFileUploadedMsg.tsx"
import { UseQueryResult } from "react-query"
import ErrorBoundary from "../../../../../../components/ErrorBoundary/ErrorBoundary.tsx"
import TimezoneMsg from "./components/TimezoneMsg.tsx"
import { useIsMobileDevice } from "../../shared/useIsMobileDevice.ts"
import { MOBILE_CONTENT_BOTTOM_PADDING_PX } from "../../shared/mobileLayout.ts"

type StageLayoutProps = {
  handleRefreshClick: () => void
  isClass: boolean
  classesQuery: UseQueryResult<Page<ClassModel>>
  clubsQuery: UseQueryResult<Page<ClubModel>>
  setActiveClassClub: (newActiveClassId: string, isClass: boolean) => void
  activeItem: ClassModel | ClubModel | null
  isWrongFileUploaded?: boolean
  isFetching?: boolean
  children: React.ReactNode
  displayTimezoneMsg?: boolean
  navigation?: React.ReactNode
}

export default function StageLayout(props: StageLayoutProps) {
  const { t } = useTranslation()
  const isMobileDevice = useIsMobileDevice()
  const contentBottomPadding = isMobileDevice ? `${MOBILE_CONTENT_BOTTOM_PADDING_PX}px` : 0

  // Component
  return (
    <Box
      sx={{
        height: "calc(100% - 64px)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {props.navigation}
      {props.isWrongFileUploaded ? <WrongResultsFileUploadedMsg /> : <></>}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 16px",
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
            <RefreshIcon
              sx={{
                animation: props.isFetching ? "spin .6s linear infinite" : "none",
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      {props.displayTimezoneMsg ? <TimezoneMsg /> : null}
      <Box
        sx={{
          marginTop: "12px",
          flex: 1,
          minHeight: 0,
          height: "100%",
          paddingBottom: contentBottomPadding,
        }}
      >
        <ErrorBoundary displayMsg>{props.children}</ErrorBoundary>
      </Box>
    </Box>
  )
}
