import {Box, Container, List, ListItem, ListItemText, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import { EventDetailModel } from "../../shared/EntityTypes";
import { useEffect, useState } from "react";
import { getEventDetail } from "../../services/EventService";
import {useTranslation} from "react-i18next";
import Launch from '@mui/icons-material/Launch'
import Button from "@mui/material/Button";

export default function EventDetail() {

    const {id} = useParams();
    const {t} = useTranslation();
    const navigate = useNavigate();

    const [detail, setDetail] = useState<EventDetailModel>();

    useEffect(() => {
        if (id) {
            getEventDetail(id).then((response) => {
                setDetail(response);
            })
        }
    }, [id]);

    return (
      <Box
        width={"100%"}
        height={"90%"}
      >
        <Box
          width={"100%"}
          height={"35%"}
          sx={{
            bgcolor:"primary.light",
            alignContent: "center"
        }}
        >
            <Container>
              <Typography>Falta Club</Typography>
              <Typography variant="body1"> {detail?.data.description}</Typography>
              <Typography>{detail?.data.initial_date} -- {detail?.data.final_date}</Typography>
              { detail?.data.website ? (
                <Button
                  variant="contained"
                  onClick={() => {window.open(detail?.data.website,'_blank','noopener,noreferrer')}}
                  endIcon={<Launch />}
                >
                {detail?.data.website}
                </Button>
                ) : ""}
            </Container>

        </Box>
        <Box
          width={"100%"}
          height={"80%"}
          sx={{
            color: 'text.secondary',
            bgcolor:'secondary.main'
        }}
        >
          <Container>
            <Typography variant={'body1'}>{t('Stages')}</Typography>
            <List>
              {detail?.data.stages.map(
                (stage)=>{
                  return (
                    <ListItem key={stage.id} onClick={()=>navigate(`/competitions/${id}/${stage.id}`)}>
                      <ListItemText>
                        {stage.description}
                      </ListItemText>
                    </ListItem>
                  )
                }
              )}
            </List>
          </Container>
        </Box>
      </Box>
    )
}