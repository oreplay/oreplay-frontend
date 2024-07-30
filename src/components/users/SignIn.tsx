import {
  Avatar,
  Box, Button, Checkbox,
  Container,
  FormControlLabel, Grid, Link,
  TextField,
  Typography
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {API_DOMAIN} from '../../services/ApiConfig.ts'
import {useAuth} from "../../shared/hooks.ts";
import React, { useRef } from "react";
import {useNavigate} from "react-router-dom";
import { popStoredLoginCodeVerifier, popStoredLoginState } from '../../services/UsersService.ts'


export default function SignIn(){

  //const [isErrorInEmail,setIsErrorInEmail] = useState(false);
  //const [isErrorInPassword,setIsErrorInPassword] = useState(false);
  const navigate = useNavigate()
  const {loginAction} = useAuth()
  const loginFormRef = useRef(null)
  const loginFormAction: string = API_DOMAIN + 'api/v1/oauth/token'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set('login_challenge', loginChallenge)
    loginFormRef.current.submit();
  };

  const {t} = useTranslation();

  let loginChallenge = ''
  const parseLoginParams = (): string => {
    // TODO this function should get the login challenge from the router (maybe router in react, using window location is ugly)
    // TODO after getting the param, the value should be removed from the URL (so it is not visible for the user)
    const url = window.location.href
    const paramLoginChallenge = url.match(/login_challenge=([^&]*)/);
    const error = url.match(/error_description=([^&]*)/);
    const authenticationCode = url.match(/code=([^&]*)/);

    if (paramLoginChallenge) {
      loginChallenge = paramLoginChallenge[1]
      return '__login_challenge_provided__'
    } else if (authenticationCode) {
      const loginState = url.match(/state=([^&]*)/);
      const storedState = popStoredLoginState()
      if (!loginState || !loginState[1] || decodeURIComponent(loginState[1]) !== storedState) {
        throw new Error(
          'State must be the same, otherwise there is a potential security issue. Stored: '
          + storedState + ', but got : ' + decodeURIComponent(loginState[1])
        )
      }
      const loginCodeVerifier = popStoredLoginCodeVerifier()
      loginAction(authenticationCode[1], loginCodeVerifier).then((succesful) => {
        if (succesful) {
          console.log('xx succesful', succesful)
          setTimeout(() => {
            console.log('xx succesful 2', succesful)
            navigate('/dashboard')
          }, 1500)
        }
      }
      )

      return '__authentication_code_provided__'
    } else if (error) {
      // TODO handle the error (for example invalid username and password
      console.error('Error ' . match[1], url)
      return '__authentication_code_provided__'
    } else {
      // TODO handle this case in the ui in a nicer way than a redirection to the startpage
      window.location = '/'
      return '__redirect_out_to_startpage__'
    }
  }
  const paramsLog: string = parseLoginParams()
  console.log('xx parseLoginParams()', paramsLog) // TODO check why this is called twice

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>

        </Avatar>
        <Typography component="h1" variant="h5">
          {t('Sign in.Sign in')}
        </Typography>
        <Box component="form" ref={loginFormRef} action={loginFormAction} method="POST" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label={t('EmailAddress')}
            name="username"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('Password')}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            name="login_challenge"
            id="login_challenge"
            value={loginChallenge}
            type="hidden"
            inputProps={{ style: { display: 'none' } }}
          />
          <TextField
            name="client_id"
            value="2658"
            id="client_id"
            type="hidden"
            inputProps={{ style: { display: 'none' } }}
          />
          <TextField
            name="grant_type"
            value="password"
            id="grant_type"
            type="hidden"
            inputProps={{ style: { display: 'none' } }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label={t('Sign in.RememberMe')}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('Sign in.Sign in')}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {t('Sign in.ForgotPassword')}
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {t('Sign in.NoAccount')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}