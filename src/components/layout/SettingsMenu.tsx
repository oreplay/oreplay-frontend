import React from 'react'
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from "@mui/icons-material/Settings";
import {ListItemText} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useState} from "react";

export default function SettingsMenu() {
  const {i18n,t} = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Settings')}>
          <IconButton
            onClick={handleClick}
            size="large"
            sx={{color: "text.secondary" }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="settings-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/**<Divider />**/}
        <MenuItem>
          <ListItemIcon>
            {"\ud83c\uddea\ud83c\uddf8"}
          </ListItemIcon>
          <ListItemText
            onClick={()=>{i18n.changeLanguage('es')}}
          >
            {t('Language.Spanish')}
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            {"\ud83c\uddec\ud83c\udde7"}
          </ListItemIcon>
          <ListItemText
            onClick={()=>{i18n.changeLanguage('en')}}
          >
            {t('Language.English')}
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            {"\ud83c\uddeb\ud83c\uddf7"}
          </ListItemIcon>
          <ListItemText
            onClick={()=>{i18n.changeLanguage('fr')}}
          >
            {t('Language.French')}
          </ListItemText>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
