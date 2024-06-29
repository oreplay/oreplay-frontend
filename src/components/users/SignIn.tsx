import {
  Avatar,
  Box, Button, Checkbox,
  Container,
  CssBaseline, FormControlLabel, Grid, Link,
  TextField,
  Typography
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {validateSignIn} from "../../services/UsersService.ts";


export default function SignIn(){

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log('validateSignIn', validateSignIn(data.get('email'),data.get('password')));// TODO remove console.log
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