import {Box, Pagination, Tab, Tabs, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import loadingIcon from "../../../../assets/loading.svg";
import { useTranslation } from "react-i18next";
import {EventModel} from "../../../../shared/EntityTypes.ts";
import {parseDate} from "../../../../shared/Functions.tsx";
import {useFetchEvents} from "../../shared/hooks.ts";

export default function EventsList() {

  const navigate = useNavigate();
  const {t} = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
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

  const [futureEventList,isFutureLoading,futurePage,setFuturePage,futureNumPages] = useFetchEvents('future')
  const [pastEventList,isPastLoading,pastPage,setPastPage,pastNumPages] = useFetchEvents('past')
  const [todayEventList,isTodayLoading] = useFetchEvents('today',100)

  function getTabList(): EventModel[] {
    switch(selectedTab){
      case 0:
        return futureEventList;
      case 1:
        return pastEventList;
      default:
        return [];
    }
  }

  if (isFutureLoading&&isPastLoading&&isTodayLoading) {
    return (
      <Box sx={{width:"100%", height:"90%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <img alt={'loading icon'} height={50} width={50} src={loadingIcon}></img>
      </Box>
    )
  } else
    return (
      //
      <Box sx={{m: "50px"}}>
        {todayEventList.length != 0 &&
          <Box width={"100%"} display={"flex"} alignItems={"center"}>
            <Box height={"16px"} width={"16px"} borderRadius={"50%"} bgcolor={"orange"}></Box>
            <Box marginLeft={"12px"}>
              <Typography>{t('EventList.LiveToday')}</Typography>
            </Box>
          </Box>
        }

        {todayEventList.length != 0 &&
          <Box hidden={todayEventList.length == 0} sx={{overflowY: 'hidden'}} width={"100%"} minHeight={"160px"} marginTop={"24px"} marginBottom={"24px"} display={"flex"}>
            {
              todayEventList.map((event, index) => {
                return (
                  <Box key={event.id} borderRadius={"6px"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} bgcolor={ index%2 == 0 ? "primary.main": "secondary.main"}
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
                <Box key={nextEvent.id} sx={{backgroundColor: "#EEEDED", width: "45%", height:"120px", padding: "12px", marginBottom: "24px"}} onClick={() => navigate(`/competitions/${nextEvent.id}`)}>
                  <Typography color={"primary.main"}>{parseDate(nextEvent.initial_date)}</Typography>
                  <Typography style={styles.titleEvents}>{nextEvent.description}</Typography>
                  <Typography style={styles.titleEvents}>{nextEvent.federation_id}</Typography>
                </Box>
              )
            })
          }
        </Box>
        <Box sx={{display:'flex',justifyContent:'center',marginBottom:2}}>
          <Pagination count={selectedTab === 0 ? futureNumPages : pastNumPages} page={selectedTab === 0 ? futurePage : pastPage} onChange={selectedTab === 0 ? (_,page)=>setFuturePage(page) : (_,page)=>setPastPage(page)} />
        </Box>
      </Box>
    )
}