import { useState, MouseEvent } from "react"
import { Menu, MenuItem, ListItemIcon, ListItemText, Box, Button } from "@mui/material"
import LanguageIcon from "@mui/icons-material/Language"
import { useTranslation } from "react-i18next"
import CataloniaFlag from "../../../../assets/flags/Catalonia.tsx"
import GaliciaFlag from "../../../../assets/flags/Galicia.tsx"
import UKFlag from "../../../../assets/flags/Uk.tsx"
import PortugalFlag from "../../../../assets/flags/Portugal.tsx"
import UkraineFlag from "../../../../assets/flags/Ukraine.tsx"
import SpainFlag from "../../../../assets/flags/Spain.tsx"
import FranceFlag from "../../../../assets/flags/France.tsx"
import BasqueCountryFlag from "../../../../assets/flags/BasqueCountry.tsx"
import CzechRepublicFlag from "../../../../assets/flags/CzechRepublic.tsx"
import RussiaFlag from "../../../../assets/flags/Russia.tsx"

const LanguageDropdown = () => {
  const { t, i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = (lang: string) => {
    void i18n.changeLanguage(lang)
    handleClose()
  }

  const languages = [
    { code: "es", flag: <SpainFlag fontSize={"inherit"} />, name: "Español" },
    { code: "en", flag: <UKFlag fontSize={"inherit"} />, name: "English" },
    { code: "ca", flag: <CataloniaFlag fontSize={"inherit"} />, name: "Català" },
    { code: "cs", flag: <CzechRepublicFlag fontSize={"inherit"} />, name: "Čeština" },
    { code: "eu", flag: <BasqueCountryFlag fontSize={"inherit"} />, name: "Euskara" },
    { code: "fr", flag: <FranceFlag fontSize={"inherit"} />, name: "Français" },
    { code: "gl", flag: <GaliciaFlag fontSize={"inherit"} />, name: "Galego" },
    { code: "pt", flag: <PortugalFlag fontSize={"inherit"} />, name: "Português" },
    { code: "ru", flag: <RussiaFlag fontSize={"inherit"} />, name: "Русский" },
    { code: "uk", flag: <UkraineFlag fontSize={"inherit"} />, name: "українська" },
  ]

  return (
    <Box>
      <Button
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        sx={{
          color: "text.secondary",
          textTransform: "none",
          fontSize: "0.875rem",
          fontWeight: 400,
          minWidth: "auto",
          padding: "4px 8px",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {t("Language.Language")}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              minWidth: "150px",
            },
          },
          list: {
            "aria-labelledby": "language-button",
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n.language === language.code}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "action.selected",
              },
              fontSize: "0.875rem",
              minHeight: "36px",
            }}
          >
            <ListItemIcon sx={{ minWidth: "28px" }}>
              <span style={{ fontSize: "16px" }}>{language.flag}</span>
            </ListItemIcon>
            <ListItemText
              primary={language.name}
              slotProps={{
                primary: {
                  fontSize: "0.875rem",
                  fontWeight: i18n.language === language.code ? 500 : 400,
                },
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default LanguageDropdown
