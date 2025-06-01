import { Box, Typography } from "@mui/material"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowForward } from "@mui/icons-material"
import { parseDate } from "../../../../shared/Functions.tsx"
import EventDetailURLButton from "./components/EventDetailURLButton.tsx"
import NotFoundPage from "../../../NotFoundError/NotFoundPage.tsx"
import GeneralSuspenseFallback from "../../../../components/GeneralSuspenseFallback.tsx"
import { useFetchEventDetail } from "../../services/FetchHooks.ts"
import { STAGE_TYPE_DATABASE_ID } from '../Results/shared/constants.ts'

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
    borderBottom: "1px solid",
    borderColor: "text.primary",
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

  const { data, isLoading, error, isError } = useFetchEventDetail(id as string)

  const detail = data?.data

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
    return <Navigate to={`/competitions/${id}/${detail.stages[0].id}`} replace={true} />
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
            bgcolor: "white",
          }}
        >
          <Box paddingTop={"48px"} paddingBottom={5}>
            <Typography
              fontWeight={"bold"}
              paddingBottom={"12px"}
              sx={{ fontSize: "large" }}
              style={styles.aligns}
            >
              {t("Stages")}
            </Typography>

            {detail?.stages.map((stage) => {
              let description = stage.description
              if (stage.stage_type.id === STAGE_TYPE_DATABASE_ID.Totals) {
                description = t("EventAdmin.Stages.StagesTypes.Totals")
              }
              return (
                <Box
                  style={styles.listStages}
                  display={"flex"}
                  justifyContent={"space-between"}
                  key={stage.id}
                  onClick={() =>
                    void navigate(`/competitions/${id}/${stage.id}`, {
                      state: {
                        eventName: detail?.description,
                        stageName: stage.description,
                        stageTypeId: stage.stage_type.id,
                        singleStage: false,
                      },
                    })
                  }
                >
                  <Typography color={"text.primary"}>{description}</Typography>
                  <ArrowForward sx={{ color: "text.primary" }} />
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    )
}
