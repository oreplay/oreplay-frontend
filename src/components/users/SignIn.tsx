import {
  Avatar,
  Box, Button, Checkbox,
  Container,
  FormControlLabel, Grid, Link,
  TextField,
  Typography
} from "@mui/material";
import {API_DOMAIN} from '../../services/ApiConfig.ts'
import React, { useRef } from "react";
import {useTranslation} from "react-i18next";


export default function SignIn(props:{loginChallenge:string}){

  //const [isErrorInEmail,setIsErrorInEmail] = useState(false);
  //const [isErrorInPassword,setIsErrorInPassword] = useState(false);
  const loginFormRef = useRef(null)
  const loginFormAction: string = API_DOMAIN + 'api/v1/oauth/token'
  const {t} = useTranslation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set('login_challenge', props.loginChallenge)
    if (loginFormRef.current) {
      loginFormRef.current.submit();
    }
  };

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
          <TextField //TODO: Remove this text field
            name="login_challenge"
            id="login_challenge"
            value={props.loginChallenge}
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