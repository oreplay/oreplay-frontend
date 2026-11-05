import { useEffect, useRef, useState } from "react"
import { getEventToken } from "../../../../../services/EventAdminService.ts"
import {
  deleteEventTokens,
  postListEventTokens,
} from "../../../../../../../infrastructure/repositories/event-tokens/event-tokens.ts"
import { Container, FormLabel, Grid, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../../../../../../shared/hooks.ts"
import { DateTime } from "luxon"
import RefreshButton from "./RefreshButton.tsx"
import { useNotifyError } from "../../../../../../../infrastructure/notifications/useNotifyError.ts"
import { latestEventToken } from "../shared/eventTokens.ts"

interface Props {
  event_id: string
}

/**
 * Shows the event's upload security token and its expiry date, and lets the organizer create or
 * renew it. Renewing revokes every valid token of the event before creating the new one, and
 * stops if any of them cannot be revoked, so a leaked token never stays valid unnoticed.
 * @param props.event_id Id of the event whose token is managed.
 */
export default function EventTokenDataGrid(props: Props) {
  const { token } = useAuth()
  const { t } = useTranslation()
  const notifyError = useNotifyError()
  const [eventToken, setEventToken] = useState<string>("")
  const [eventTokenExpireDate, setEventTokenExpireDate] = useState<DateTime | null>(null)
  const [validTokens, setValidTokens] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [areTokensLoaded, setAreTokensLoaded] = useState(false)
  const isRenewing = useRef(false)

  /**
   * Loads the event's valid tokens from the backend and shows the one that expires last, or none.
   * It is also how a failed renewal resyncs, since some tokens may already have been revoked.
   */
  const loadTokens = async () => {
    try {
      const response = await getEventToken(props.event_id, token)
      const latest = latestEventToken(response.data)
      setValidTokens(response.data.map((eventTokenData) => eventTokenData.token))
      setEventToken(latest?.token ?? "")
      setEventTokenExpireDate(latest ? DateTime.fromISO(latest.expires) : null)
      setAreTokensLoaded(true)
    } catch (error) {
      setAreTokensLoaded(false)
      notifyError(error)
    }
  }

  useEffect(() => {
    void loadTokens().finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleRenewToken = () => {
    void renewToken()
  }

  /**
   * Revokes every valid token of the event and then creates a new one. Nothing is created when a
   * revocation fails, because the old token would otherwise keep working behind the new one; the
   * tokens are then reloaded, as the ones revoked before the failure are gone. It does nothing while
   * another renewal is running or before the current tokens are known, since it could only revoke
   * the tokens it knows about and would leave the others valid.
   */
  const renewToken = async () => {
    if (isRenewing.current || !areTokensLoaded) return
    isRenewing.current = true
    setIsLoading(true)
    try {
      for (const validToken of validTokens) {
        await deleteEventTokens(props.event_id, validToken)
      }
      const response = await postListEventTokens(props.event_id, {
        expires: DateTime.now().endOf("day").plus({ month: 1 }).toUTC().toISO() ?? undefined,
      })
      setEventToken(response.data.token!)
      setEventTokenExpireDate(DateTime.fromISO(response.data.expires!))
      setValidTokens([response.data.token!])
    } catch (error) {
      notifyError(error)
      await loadTokens()
    } finally {
      isRenewing.current = false
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
            value={
              isLoading ? t("common:loading") : eventToken ? `${props.event_id}${eventToken}` : ""
            }
            disabled
            slotProps={{
              input: {
                endAdornment: (
                  <RefreshButton
                    eventToken={eventToken || ""}
                    handleRenewToken={handleRenewToken}
                    eventId={props.event_id}
                    isDisabled={isLoading || !areTokensLoaded}
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
                ? t("common:loading")
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
