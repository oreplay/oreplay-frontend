import {
  Avatar,
  Box, Button, Checkbox,
  Container,
  CssBaseline, FormControlLabel, Grid, Link,
  TextField,
  Typography
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../shared/hooks.ts";
import React from "react";
import {useNavigate} from "react-router-dom";


export default function SignIn(){

  //const [isErrorInEmail,setIsErrorInEmail] = useState(false);
  //const [isErrorInPassword,setIsErrorInPassword] = useState(false);
  const navigate = useNavigate()
  const {loginAction} = useAuth()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    loginAction(email,password).then( (succesful)=> {
      if (succesful) {
        navigate('/dashboard')
        }
      }
    )
  };

  const {t} = useTranslation();

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('EmailAddress')}
              name="email"
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