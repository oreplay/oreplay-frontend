import { useState, MouseEvent } from "react"
import { Menu, MenuItem, ListItemIcon, ListItemText, Box, Button } from "@mui/material"
import LanguageIcon from "@mui/icons-material/Language"
import { useTranslation } from "react-i18next"
import { supportedLanguages } from "../../../../supportedLanguages.tsx"

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
        {supportedLanguages.map((language) => (
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
