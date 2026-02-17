import { useEffect, useState } from "react"
import {
  getEventToken,
  invalidateEventToken,
  postEventToken,
} from "../../../../../services/EventAdminService.ts"
import { Container, FormLabel, Grid2 as Grid, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../../../../../../shared/hooks.ts"
import { DateTime } from "luxon"
import RefreshButton from "./RefreshButton.tsx"

interface Props {
  event_id: string
}

export default function EventTokenDataGrid(props: Props) {
  const { token } = useAuth()
  const { t } = useTranslation()
  const [eventToken, setEventToken] = useState<string>("")
  const [eventTokenExpireDate, setEventTokenExpireDate] = useState<DateTime | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getResponse = getEventToken(props.event_id, token)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getResponse.then((response) => {
      // Check if there are security tokens
      if (response.data.length > 0) {
        setEventToken(response.data[0].token)
        setEventTokenExpireDate(DateTime.fromISO(response.data[0].expires))
      }
      setIsLoading(false)

      return () => setIsLoading(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleRenewToken = () => {
    void handleRenewToken2()
  }
  const handleRenewToken2 = async () => {
    setIsLoading(true)
    if (eventToken != "") {
      try {
        await invalidateEventToken(props.event_id, eventToken, token as string)
      } catch (error) {
        console.log("Error in invalidateEventToken", error)
        setIsLoading(false)
      }
    }
    try {
      const response = await postEventToken(props.event_id, token as string)
      setEventToken(response.data.token)
      setEventTokenExpireDate(DateTime.fromISO(response.data.expires))
      setIsLoading(false)
    } catch (error) {
      console.log("error in postEventToken", error)
      setIsLoading(false)
    }
  }

  return (
    <Container component="form" disableGutters>
      <Grid
        container
        spacing={2}
        sx={{
          marginY: "2em",
        }}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <FormLabel>{t("EventAdmin.EventSecurityTokens")}</FormLabel>
          <TextField
            fullWidth
            id="securityToken"
            name="securityToken"
            value={isLoading ? t("Loading") : eventToken ? `${props.event_id}${eventToken}` : ""}
            disabled
            slotProps={{
              input: {
                endAdornment: (
                  <RefreshButton
                    eventToken={eventToken || ""}
                    handleRenewToken={handleRenewToken}
                    eventId={props.event_id}
                  />
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormLabel>{t("EventAdmin.EventSecurityTokensExpireDate")}</FormLabel>
          <TextField
            fullWidth
            id="tokenExpiracyDate"
            name="token expiry date"
            error={eventTokenExpireDate ? eventTokenExpireDate < DateTime.now() : false}
            disabled
            value={
              isLoading
                ? t("Loading")
                : eventTokenExpireDate
                  ? eventTokenExpireDate.toLocaleString(DateTime.DATE_SHORT)
                  : ""
            }
          />
        </Grid>
      </Grid>
    </Container>
  )
}
