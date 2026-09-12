import { Box, Typography } from "@mui/material"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowForward } from "@mui/icons-material"
import { parseDate } from "../../../../shared/Functions.tsx"
import EventDetailURLButton from "./components/EventDetailURLButton.tsx"
import NotFoundPage from "../../../NotFoundPage/NotFoundPage.tsx"
import GeneralSuspenseFallback from "../../../../components/GeneralSuspenseFallback.tsx"
import { useFetchEventDetail } from "../../services/FetchHooks.ts"
import { STAGE_TYPE_DATABASE_ID } from "../Results/shared/constants.ts"
import { DateTime } from "luxon"
import CountryFlag from "../../../../components/CountryFlag/CountryFlag.tsx"
import { useCountry } from "../../../../services/countryService/countryHooks.ts"

const styles = {
  titleEvent: {
    marginTop: "8px",
    fontWeight: 700,
    fontSize: "x-large",
    lineHeight: 1.25,
  },
}

export default function EventDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const countryT = useCountry()
  const navigate = useNavigate()

  const { data, isLoading, error, isError } = useFetchEventDetail(id as string)

  const detail = data?.data

  function getDatesOfEvent() {
    if (detail?.initial_date && detail?.final_date) {
      const initDateParse = parseDate(detail.initial_date)
      const finalDateParse = parseDate(detail.final_date)

      if (initDateParse == finalDateParse) {
        return initDateParse
      } else {
        return `${initDateParse} - ${finalDateParse}`
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
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: "35%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "linear-gradient(150deg, #F9D2FF 0%, #FFE9CB 100%)",
            paddingY: 4,
            paddingX: { xs: "32px", sm: "56px" },
            flexGrow: 1,
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        >
          {detail?.country_code ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                width: "100%",
                marginBottom: "6px",
              }}
            >
              <CountryFlag
                code={detail?.country_code.toLowerCase()}
                slotProps={{
                  picture: { display: "flex", alignItems: "center" },
                  image: { width: "12px", display: "block" },
                }}
              />
              <Typography
                sx={{ fontSize: 10, color: "text.secondary", fontWeight: 600, lineHeight: 1 }}
              >
                {countryT(detail.country_code)}{" "}
              </Typography>{" "}
            </Box>
          ) : null}
          <Typography sx={{ color: "text.secondary", fontSize: "small", fontWeight: 500 }}>
            {detail?.organizer?.name}
          </Typography>
          <Typography sx={{ color: "text.primary" }} style={styles.titleEvent}>
            {detail?.description}
          </Typography>
          {getDatesOfEvent() ? (
            <Typography sx={{ color: "text.secondary", marginTop: "6px" }}>
              {getDatesOfEvent()}
            </Typography>
          ) : null}
          <EventDetailURLButton url={detail?.website} marginLeft="0px" marginRight="0px" />
        </Box>
        <Box
          sx={{
            height: "100%",
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              paddingTop: "48px",
              paddingBottom: 5,
              paddingX: { xs: "20px", sm: "48px" },
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                fontSize: "large",
                color: "text.secondary",
                paddingBottom: "16px",
                paddingLeft: "12px",
              }}
            >
              {t("Stages")}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {detail?.stages.map((stage) => {
                let description = stage.description
                if (stage.stage_type.id === STAGE_TYPE_DATABASE_ID.Totals) {
                  description = t("EventAdmin.Stages.StagesTypes.Totals.title")
                }
                return (
                  <Box
                    key={stage.id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "background.paper",
                      border: "1px solid",
                      borderColor: "grey.200",
                      borderRadius: "12px",
                      padding: "16px 20px",
                      boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      "&:hover": {
                        transform: "translateX(4px)",
                        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.08)",
                        borderColor: "primary.main",
                      },
                    }}
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
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 0.5,
                      }}
                    >
                      <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
                        {description}
                      </Typography>
                      {stage.start ? (
                        <Typography sx={{ color: "text.secondary", fontSize: "small" }}>
                          {DateTime.fromISO(stage.start).toLocaleString(
                            DateTime.DATETIME_MED_WITH_WEEKDAY,
                          )}
                        </Typography>
                      ) : null}
                    </Box>
                    <ArrowForward sx={{ color: "primary.main", fontSize: "20px" }} />
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    )
}
