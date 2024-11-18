import {Box, Typography} from "@mui/material";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import loadingIcon from "../../../../assets/loading.svg";
import {useEffect, useState} from "react";
import {getEventDetail} from "../../services/EventService.ts";
import {useTranslation} from "react-i18next";
import {ArrowForward} from "@mui/icons-material";
import {EventDetailModel} from "../../../../shared/EntityTypes.ts";
import {parseDate} from "../../../../shared/Functions.tsx";
import EventDetailURLButton from "./components/EventDetailURLButton.tsx";

export default function EventDetail() {

  const {id} = useParams();
  const {t} = useTranslation();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<EventDetailModel>();
  const [loadingData, setLoadingData] = useState(true);

  const styles = {
    titleEvent: {
      marginTop: "6px",
      fontWeight: "bold",
      fontSize: "x-large",
      marginLeft: "48px",
      marginRight: "48px"
    },
    aligns: {
      marginLeft: "48px",
      marginRight: "48px"
    },
    listStages: {
      borderBottom: "1px solid white",
      marginLeft: "48px",
      marginRight: "48px",
      height: "min-content",
      padding: "24px 0px"
    }
  }

  useEffect(() => {
    if (id) {
      getEventDetail(id).then((response) => {
        setDetail(response.data);
        setLoadingData(false);
      })
    }
  }, [id]);

  function getDatesOfEvent() {
    if (detail?.initial_date && detail?.final_date) {
      const initDateParse = parseDate(detail.initial_date);
      const finalDateParse = parseDate(detail.final_date);

      if (initDateParse == finalDateParse) {
        return <Typography style={styles.aligns}>{initDateParse}</Typography>
      } else {
        return <Typography style={styles.aligns}
          marginTop={"6px"}>{initDateParse} - {finalDateParse}</Typography>
      }
    }
    return null;
  }

  if (loadingData) {
    return (
      <Box sx={{
        width: "100%",
        height: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <img alt={'loading icon'} height={50} width={50} src={loadingIcon}></img>
      </Box>
    )
  } else if (detail?.stages.length == 1) {// navigate to stage for single stage events
    return <Navigate
      to={`/competitions/${id}/${detail.stages[0].id}`}
      state={{eventName: detail.description, stageName: detail.stages[0].description, stageTypeId:detail.stages[0].stage_type.id, singleStage:true}}
      replace={true}
    />
  } else return (
    <Box width={"100%"} height={"100%"} display={"flex"} flexDirection={"column"}>
      <Box width={"100%"} minHeight={"35%"} display={"flex"} flexDirection={"column"}
        justifyContent={"center"} sx={{
          bgcolor: "primary.light",
        }}>

        {/**<Typography style={styles.aligns}>Club organizador</Typography>**/}
        <Typography color={"secondary.main"}
          style={styles.titleEvent}>{detail?.description}</Typography>
        {getDatesOfEvent()}
        <EventDetailURLButton url={detail?.website} marginLeft={styles.aligns.marginLeft} marginRight={styles.aligns.marginRight}/>
      </Box>
      <Box height={"100%"} sx={{
        bgcolor: "secondary.main",
      }}>
        <Box paddingTop={"48px"}>
          <Typography fontWeight={"bold"} paddingBottom={"48px"} style={styles.aligns}
            color={"primary.light"}>{t('Stages')}</Typography>

          {detail?.stages.map(
            (stage) => {
              return (
                <Box style={styles.listStages} display={"flex"} justifyContent={"space-between"}
                  key={stage.id}
                  onClick={() => navigate(`/competitions/${id}/${stage.id}`,
                    {state: {eventName: detail?.description, stageName: stage.description, stageTypeId:stage.stage_type.id, singleStage:false}})}>
                  <Typography color={"primary.light"}>
                    {stage.description}
                  </Typography>
                  <ArrowForward sx={{color: "primary.light"}}/>
                </Box>
              )
            }
          )}
        </Box>
      </Box>
    </Box>
  )
}