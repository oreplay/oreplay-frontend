import React, { useState } from "react"

import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next"
import ConstructionIcon from "@mui/icons-material/Construction"
import { Alert } from "@mui/material"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function UploadStartTimesTabs() {
  const [value, setValue] = useState<number>(0)
  const { t } = useTranslation("organizers")

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={t("BeforeTheRace.UploadStartTimes.Tabs1.OE.title")} id={"OE"} />
          <Tab label={t("BeforeTheRace.UploadStartTimes.Tabs1.MeOS.title")} id={"MeOS"} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Typography>{t("BeforeTheRace.UploadStartTimes.Tabs1.OE.p1")}</Typography>
        <Box
          component="img"
          src={t("BeforeTheRace.UploadStartTimes.Tabs1.OE.img1.url")}
          alt={t("BeforeTheRace.UploadStartTimes.Tabs1.OE.img1.alt")}
          loading={"lazy"}
        />
        <Typography>{t("BeforeTheRace.UploadStartTimes.Tabs1.OE.p2")}</Typography>
        <Box
          component="img"
          src={t("BeforeTheRace.UploadStartTimes.Tabs1.OE.img2.url")}
          alt={t("BeforeTheRace.UploadStartTimes.Tabs1.OE.img2.alt")}
          loading={"lazy"}
        />
        <Typography>{t("BeforeTheRace.UploadStartTimes.Tabs1.OE.p3")}</Typography>
        <Box
          component="img"
          src={t("BeforeTheRace.UploadStartTimes.Tabs1.OE.img3.url")}
          alt={t("BeforeTheRace.UploadStartTimes.Tabs1.OE.img3.alt")}
          loading={"lazy"}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Alert icon={<ConstructionIcon />} severity="info" sx={{ my: "2em" }}>
          {t("DevelopingMsg")}
        </Alert>
      </CustomTabPanel>
    </Box>
  )
}
