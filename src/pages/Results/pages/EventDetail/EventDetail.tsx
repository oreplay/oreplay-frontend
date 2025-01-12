import { Box, Typography } from "@mui/material"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { getEventDetail } from "../../services/EventService.ts"
import { useTranslation } from "react-i18next"
import { ArrowForward } from "@mui/icons-material"
import { Data, EventDetailModel } from "../../../../shared/EntityTypes.ts"
import { parseDate } from "../../../../shared/Functions.tsx"
import EventDetailURLButton from "./components/EventDetailURLButton.tsx"
import { useQuery } from "react-query"
import NotFoundPage from "../../../NotFoundError/NotFoundPage.tsx"
import GeneralSuspenseFallback from "../../../../components/GeneralSuspenseFallback.tsx"
import { AxiosError, AxiosResponse } from "axios"

const styles = {
  titleEvent: {
    marginTop: "6px",
    fontWeight: "bold",
    fontSize: "x-large",
    marginLeft: "48px",
    marginRight: "48px",
  },
  aligns: {
    marginLeft: "48px",
    marginRight: "48px",
  },
  listStages: {
    borderBottom: "1px solid white",
    marginLeft: "48px",
    marginRight: "48px",
    height: "min-content",
    padding: "24px 0px",
  },
}

export default function EventDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data, isLoading, error, isError } = useQuery<
    AxiosResponse<Data<EventDetailModel>>,
    AxiosError
  >(
    ["eventDetail", id], // Query key
    () => getEventDetail(id as string, undefined), // Query function
    {
      enabled: !!id, // Only fetch if id exists
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.response && error.response.status < 500) {
          return false
        }
        return failureCount < 3
      },
    },
  )

  const detail = data?.data.data

  function getDatesOfEvent() {
    if (detail?.initial_date && detail?.final_date) {
      const initDateParse = parseDate(detail.initial_date)
      const finalDateParse = parseDate(detail.final_date)

      if (initDateParse == finalDateParse) {
        return (
          <Typography style={styles.aligns} sx={{ color: "text.secondary" }}>
            {initDateParse}
          </Typography>
        )
      } else {
        return (
          <Typography style={styles.aligns} sx={{ color: "text.secondary" }} marginTop={"6px"}>
            {initDateParse} - {finalDateParse}
          </Typography>
        )
      }
    }
    return null
  }

  if (isLoading) {
    return <GeneralSuspenseFallback />
  } else if (isError) {
    const error_status = error.response?.status
    if (error_status == 403 || error_status == 404) {
      return <NotFoundPage />
    }
    throw error
  } else if (detail?.stages.length == 1) {
    // navigate to stage for single stage events
    return (
      <Navigate
        to={`/competitions/${id}/${detail.stages[0].id}`}
        state={{
          eventName: detail.description,
          stageName: detail.stages[0].description,
          stageTypeId: detail.stages[0].stage_type.id,
          singleStage: true,
        }}
        replace={true}
      />
    )
  } else
    return (
      <Box width={"100%"} height={"100%"} display={"flex"} flexDirection={"column"}>
        <Box
          width={"100%"}
          minHeight={"35%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          sx={{
            bgcolor: "primary.light",
          }}
        >
          <Typography style={styles.aligns} sx={{ color: "text.secondary", fontSize: "small" }}>
            {detail?.organizer?.name}
          </Typography>
          <Typography color={"secondary.main"} style={styles.titleEvent}>
            {detail?.description}
          </Typography>
          {getDatesOfEvent()}
          <EventDetailURLButton
            url={detail?.website}
            marginLeft={styles.aligns.marginLeft}
            marginRight={styles.aligns.marginRight}
          />
        </Box>
        <Box
          height={"100%"}
          sx={{
            bgcolor: "secondary.main",
          }}
        >
          <Box paddingTop={"48px"}>
            <Typography
              fontWeight={"bold"}
              paddingBottom={"48px"}
              style={styles.aligns}
              color={"primary.light"}
            >
              {t("Stages")}
            </Typography>

            {detail?.stages.map((stage) => {
              return (
                <Box
                  style={styles.listStages}
                  display={"flex"}
                  justifyContent={"space-between"}
                  key={stage.id}
                  onClick={() =>
                    navigate(`/competitions/${id}/${stage.id}`, {
                      state: {
                        eventName: detail?.description,
                        stageName: stage.description,
                        stageTypeId: stage.stage_type.id,
                        singleStage: false,
                      },
                    })
                  }
                >
                  <Typography color={"primary.light"}>{stage.description}</Typography>
                  <ArrowForward sx={{ color: "primary.light" }} />
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    )
}
