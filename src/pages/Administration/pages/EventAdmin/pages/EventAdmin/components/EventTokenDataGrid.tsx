import { useEffect, useState } from "react";
import {
  getEventToken,
  invalidateEventToken,
  postEventToken,
} from "../../../../../services/EventAdminService.ts";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { CopyToClipBoardButton } from "../../../../../../../shared/Components.tsx";
import { useAuth } from "../../../../../../../shared/hooks.ts";

interface Props {
  event_id: string;
}

interface RefreshButtonParams {
  handleRenewToken: () => void;
  eventToken: string;
}

function RefreshButton(props: RefreshButtonParams) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const handleClose = () => {
    setIsDialogOpen(false);
  };
  const handleRenewAndClose = () => {
    props.handleRenewToken();
    setIsDialogOpen(false);
  };

  return (
    <>
      {props.eventToken == "" ? (
        <IconButton>
          <Tooltip title={t("EventAdmin.Create security keys")}>
            <AddIcon onClick={() => props.handleRenewToken()} />
          </Tooltip>
        </IconButton>
      ) : (
        <>
          <IconButton>
            <Tooltip title={t("EventAdmin.Renew security keys")}>
              <AutorenewIcon onClick={() => setIsDialogOpen(true)} />
            </Tooltip>
          </IconButton>
          <CopyToClipBoardButton value={props.eventToken} />
        </>
      )}
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          {t("EventAdmin.Do you want to renew the security key?")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("EventAdmin.RenewEventTokenMsg")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button variant="contained" onClick={handleRenewAndClose} autoFocus>
            {t("EventAdmin.Renew")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function EventTokenDataGrid(props: Props) {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [eventToken, setEventToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getResponse = getEventToken(props.event_id, token);
    getResponse.then((response) => {
      // Check if there are security tokens
      if (response.data.length > 0) {
        setEventToken(response.data[0].token);
      }
      setIsLoading(false);

      return () => setIsLoading(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRenewToken = async () => {
    setIsLoading(true);
    if (eventToken != "") {
      try {
        await invalidateEventToken(props.event_id, eventToken, token as string);
      } catch (error) {
        console.log("Error in invalidateEventToken", error);
        setIsLoading(false);
      }
    }
    try {
      const response = await postEventToken(props.event_id, token as string);
      setEventToken(response.data.token);
      setIsLoading(false);
    } catch (error) {
      console.log("error in postEventToken", error);
      setIsLoading(false);
    }
  };

  return (
    <Container component="form">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "space-between",
          marginY: "2em",
        }}
      >
        <TextField
          fullWidth
          id="eventId"
          name="eventId"
          label={t("EventAdmin.EventId")}
          defaultValue={props.event_id}
          disabled
          sx={{ marginY: "1em" }}
          InputProps={{ endAdornment: <CopyToClipBoardButton value={props.event_id} /> }}
        />
        <TextField
          fullWidth
          id="securityToken"
          name="securityToken"
          label={t("EventAdmin.EventSecurityTokens")}
          value={isLoading ? t("Loading") : eventToken}
          disabled
          InputProps={{
            endAdornment: (
              <RefreshButton eventToken={eventToken} handleRenewToken={handleRenewToken} />
            ),
          }}
        />
      </Box>
    </Container>
  );
}
