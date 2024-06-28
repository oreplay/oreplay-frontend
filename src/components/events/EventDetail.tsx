import {Box, Container, List, ListItem, ListItemText, Typography} from "@mui/material";
import { useParams } from "react-router-dom";
import { EventDetailModel } from "../../shared/EntityTypes";
import { useEffect, useState } from "react";
import { getEventDetail } from "../../services/EventService";
import {useTranslation} from "react-i18next";
import Launch from '@mui/icons-material/Launch'
import PrimaryButton from '../common/PrimaryButton.tsx'

export default function EventDetail() {

    const {id} = useParams();
    const {t} = useTranslation();

    const [detail, setDetail] = useState<EventDetailModel>()

    const url = 'https://github.com/oreplay/oreplay-frontend' //remove when implemented in backend

    useEffect(() => {
        if (id) {
            getEventDetail(id).then((response) => {
                setDetail(response);
            })
        }
    }, []);

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
              <Typography variant="h3"> {detail?.data.description}</Typography>
              <Typography>{detail?.data.initial_date} -- {detail?.data.final_date}</Typography>
              <PrimaryButton
                text="www.faltaURL.com"
                url={url}
                target="_blank"
                icon={<Launch />}
              />
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
            <Typography variant={'h2'}>{t('Stages')}</Typography>
            <List>
              {detail?.data.stages.map(
                (stage)=>{
                  return (
                    <ListItem onClick={()=>{alert('On progress')}}>
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