import {Box, Button, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import { EventDetailModel } from "../../shared/EntityTypes";
import loadingIcon from "./../../assets/loading.svg";
import { useEffect, useState } from "react";
import { getEventDetail } from "../../services/EventService";
import {useTranslation} from "react-i18next";
import { parseDate } from "../../shared/Functions";
import { ArrowForward, Launch } from "@mui/icons-material";

export default function EventDetail() {

  const {id} = useParams();
  const {t} = useTranslation();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<EventDetailModel>();
  const [loadingData, setLoadingData] = useState(true);

  const styles = {
    titleEvent: {
      marginTop: "6px",
      fontWeight:"bold",
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

  function getDatesOfEvent(){
    if (detail?.initial_date && detail?.final_date)
    {
      const initDateParse = parseDate(detail.initial_date);
      const finalDateParse = parseDate(detail.final_date);

      if (initDateParse == finalDateParse)
      {
        return <Typography style={styles.aligns} >{initDateParse}</Typography>
      }
      else {
        return <Typography style={styles.aligns} marginTop={"6px"}>{initDateParse} - {finalDateParse}</Typography>
      }
    }
    return null;
  }

  function getButtonWebsite()
  {
    if (detail?.website) {
      return (
        <Button style={styles.aligns} sx={{width: "min-content", marginTop: "12px", color: "white"}} variant="contained"
          onClick={() => {window.open(detail?.website,'_blank','noopener,noreferrer')}} endIcon={<Launch />}>
          {detail.website}
        </Button>
      )
    }

  }

  if (loadingData) {
    return (
      <Box sx={{width:"100%", height:"90%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <img alt={'loading icon'} height={50} width={50} src={loadingIcon}></img>
      </Box>
    )
  } else return (
    <Box width={"100%"} height={"100%"}>
      <Box width={"100%"} minHeight={"35%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} sx={{
        bgcolor:"primary.light",
      }}>

        <Typography style={styles.aligns}>Club organizador</Typography>
        <Typography color={"secondary.main"} style={styles.titleEvent}>{detail?.description}</Typography>
        {getDatesOfEvent()}
        {getButtonWebsite()}
      </Box>
      <Box height={"100%"} sx={{
        bgcolor:"secondary.main",
      }}>
        <Box paddingTop={"48px"}>
          <Typography fontWeight={"bold"} paddingBottom={"48px"} style={styles.aligns} color={"primary.light"}>{t('Stages')}</Typography>

          {detail?.stages.map(
            (stage)=>{
              return (
                <Box style={styles.listStages} display={"flex"} justifyContent={"space-between"} key={stage.id} onClick={()=>navigate(`/competitions/${id}/${stage.id}/results`)}>
                  <Typography color={"primary.light"}>
                    {stage.description}
                  </Typography>
                  <ArrowForward sx={{color:"primary.light"}}/>
                </Box>
              )
            }
          )}
        </Box>
      </Box>
    </Box>
  )
}