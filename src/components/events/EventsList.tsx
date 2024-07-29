import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import loadingIcon from "./../../assets/loading.svg";
import { getEventList } from "../../services/EventService";
import { EventModel } from "../../shared/EntityTypes";
import { useTranslation } from "react-i18next";
import { DateTime } from 'luxon'
import { parseDate } from "../../shared/Functions";

export default function EventsList() {

  const navigate = useNavigate();
  const {t} = useTranslation();
  const [actualEventList, setActualEventList] = useState<EventModel[]>([]);
  const [previousEventList, setPreviousEventList] = useState<EventModel[]>([]);
  const [nextEventList, setNextEventList] = useState<EventModel[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  }

  const styles = {
    typographyBox: {
      color: "white",
      margin: "12px"
    },
    titleEvents: {
      marginTop: "6px"
    }
  }

  useEffect(() => {
    getEventList().then((response) => {
      const actualDate = DateTime.now();
      const actualDataList: EventModel[] = [];
      const previousDataList: EventModel[] = [];
      const nextDataList: EventModel[] = [];
      response.data.forEach(event => {

        const initDate = DateTime.fromISO(event.initial_date);
        const endDate = DateTime.fromISO(event.final_date);

        if (initDate>actualDate){
          nextDataList.push(event);
        } else if (endDate<actualDate) {
          previousDataList.push(event);
        } else {
          actualDataList.push(event);
        }
      });
      setActualEventList(actualDataList);
      setPreviousEventList(previousDataList);
      setNextEventList(nextDataList);
      setLoadingData(false);

    });
  },[]);

  function getTabList(): EventModel[] {
    switch(selectedTab){
      case 0:
        return nextEventList;
      case 1:
        return previousEventList;
      default:
        return [];
    }
  }

  if (loadingData){
    return (
      <Box sx={{width:"100%", height:"90%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <img alt={'loading icon'} height={50} width={50} src={loadingIcon}></img>
      </Box>
    )
  } else
    return (
      <Box sx={{m: "50px"}}>
        {actualEventList.length != 0 &&
          <Box width={"100%"}display={"flex"} alignItems={"center"}>
            <Box height={"16px"} width={"16px"} borderRadius={"50%"} bgcolor={"orange"}></Box>
            <Box marginLeft={"12px"}>
              <Typography>{t('EventList.LiveToday')}</Typography>
            </Box>
          </Box>
        }

        {actualEventList.length != 0 &&
          <Box hidden={actualEventList.length == 0} sx={{overflowY: 'hidden'}} width={"100%"} minHeight={"160px"} marginTop={"24px"} marginBottom={"24px"} display={"flex"}>
            {
              actualEventList.map((event, index) => {
                return (
                  <Box borderRadius={"6px"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} bgcolor={ index%2 == 0 ? "primary.main": "secondary.main"}
                    minWidth={"220px"} width={"220px"} height={"160px"} marginRight={"24px"} onClick={() => navigate(`/competitions/${event.id}`)}>
                    <Typography style={styles.typographyBox} fontWeight={"bolder"}>{event.description}</Typography>
                    <Typography style={styles.typographyBox}>{event.federation_id}</Typography>
                  </Box>
                )
              })
            }
          </Box>
        }
        <Box sx={{borderBottom:1, borderColor: 'divider', marginTop:'100px'}}>
          <Tabs value={selectedTab} indicatorColor="primary" onChange={handleChangeTab}>
            <Tab label={t('EventList.FutureEvents')} value={0}/>
            <Tab label={t('EventList.PastEvents')} value={1}/>
          </Tabs>
        </Box>
        <Box sx={{marginTop: "24px", display:"flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between"}}>
          {
            getTabList().map((nextEvent) => {
              return (
                <Box sx={{backgroundColor: "#EEEDED", width: "45%", height:"120px", padding: "12px", marginBottom: "24px"}} onClick={() => navigate(`/competitions/${nextEvent.id}`)}>
                  <Typography color={"primary.main"}>{parseDate(nextEvent.initial_date)}</Typography>
                  <Typography style={styles.titleEvents}>{nextEvent.description}</Typography>
                  <Typography style={styles.titleEvents}>{nextEvent.federation_id}</Typography>
                </Box>
              )
            })
          }
        </Box>
      </Box>
    )
}