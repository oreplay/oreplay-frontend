import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import loadingIcon from "./../../assets/loading.svg";
import { getEventList } from "../../services/EventService";
import { EventModel } from "../../shared/EntityTypes";

export default function EventsList() {

    const navigate = useNavigate();
    // const { t } = useTranslation();
    const [eventList, setEventList] = useState<EventModel[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        getEventList().then((response) => {
            setEventList(response.data);
            setLoadingData(false);
        });
    },[]);

    if (loadingData){
      return (
        <Box sx={{width:"100%", height:"90%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <img alt={'loading icon'} height={50} width={50} src={loadingIcon}></img>
        </Box>
      )
    } else
    return (
        <Box sx={{m: "50px"}}>
            <TableContainer>
                <Table>
                    <TableBody>
                        {eventList.map((e) => (
                            <TableRow key={e.id} onClick={() => navigate(`/competitions/${e.id}`)} hover>
                                <TableCell>{e.description}</TableCell>
                                <TableCell>{e.federation_id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}