import { useState } from "react"
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material"
import LanguageIcon from "@mui/icons-material/Language"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { useTranslation } from "react-i18next"

const LanguageNestedList = () => {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const toggleNestedList = () => {
    setOpen((prev) => !prev)
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <>
      {/* Main List Item */}
      <ListItem>
        <ListItemButton onClick={toggleNestedList}>
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText primary={t("Language.Language")} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>

      {/* Nested List */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleLanguageChange("es")}>
              <ListItemIcon>{"\ud83c\uddea\ud83c\uddf8"}</ListItemIcon>
              <ListItemText primary={t("Language.Spanish")} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleLanguageChange("en")}>
              <ListItemIcon>{"\ud83c\uddec\ud83c\udde7"}</ListItemIcon>
              <ListItemText primary={t("Language.English")} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleLanguageChange("fr")}>
              <ListItemIcon>{"\ud83c\uddeb\ud83c\uddf7"}</ListItemIcon>
              <ListItemText primary={t("Language.French")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>
    </>
  )
}

export default LanguageNestedList
