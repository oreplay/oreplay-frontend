import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material"
import React from "react"
import { useTranslation } from "react-i18next"
import { Navigate, useSearchParams } from "react-router-dom"
import { API_DOMAIN } from "../../../../../services/ApiConfig.ts"

export default function SignIn() {
  //const [isErrorInEmail,setIsErrorInEmail] = useState(false);
  //const [isErrorInPassword,setIsErrorInPassword] = useState(false);
  const loginFormAction: string = API_DOMAIN + "api/v1/oauth/token"
  const { t } = useTranslation()

  const [searchParams] = useSearchParams()
  const loginChallenge = searchParams.get("login_challenge")
  if (!loginChallenge) {
    return <Navigate to="/signin" />
  } else {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      data.set("login_challenge", loginChallenge)
      event.currentTarget.submit()
    }

    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            {t("Sign in.Sign in")}
          </Typography>
          <Box
            component="form"
            action={loginFormAction}
            method="POST"
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={t("EmailAddress")}
              name="username"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("Password")}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField //TODO: Remove this text field
              name="login_challenge"
              id="login_challenge"
              value={loginChallenge}
              type="hidden"
              sx={{ display: "none" }}
            />
            <TextField
              name="client_id"
              value="2658"
              id="client_id"
              type="hidden"
              sx={{ display: "none" }}
            />
            <TextField
              name="grant_type"
              value="password"
              id="grant_type"
              type="hidden"
              sx={{ display: "none" }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              sx={{ display: "none" }}
              label={t("Sign in.RememberMe")}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              {t("Sign in.Sign in")}
            </Button>
            <Grid container sx={{ display: "none" }}>
              <Grid item xs>
                <Link href="#" variant="body2">
                  {t("Sign in.ForgotPassword")}
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {t("Sign in.NoAccount")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    )
  }
}
