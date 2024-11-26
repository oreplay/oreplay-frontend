import {ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {useAuth} from "../../../../shared/hooks.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from '@mui/icons-material/Logout';

const AuthenticationSidebarItem = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {user,logoutAction} = useAuth()

  if (user) {
    // Logout option
    return (
      <ListItem>
        <ListItemButton onClick={() => {
          logoutAction().then(()=>{ //TODO: Implement real logout within logoutAction
            navigate('/')
          })
        }}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t('Sign in.Logout')}/>
        </ListItemButton>
      </ListItem>
    )
  } else {
    // Login option
    return (
      <ListItem>
        <ListItemButton onClick={() => navigate('/signin')}>
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary={t('Sign in.Sign in')}/>
        </ListItemButton>
      </ListItem>
    )
  }

}

export default AuthenticationSidebarItem