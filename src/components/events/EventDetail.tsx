import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { EventDetailModel } from "../../shared/EntityTypes";
import { useEffect, useState } from "react";
import { getEventDetail } from "../../services/EventService";

export default function EventDetail() {

    const {id} = useParams();

    const [detail, setDetail] = useState<EventDetailModel>()

    useEffect(() => {
        if (id) {
            getEventDetail(id).then((response) => {
                setDetail(response);
            })
        }
    }, []);

    return (
        <Box>
            <Typography>{detail?.data.description}</Typography>
        </Box>
    )
}