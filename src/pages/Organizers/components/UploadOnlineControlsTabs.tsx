import React, { useState } from "react"

import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next"
import { Divider } from "@mui/material"

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

export default function UploadOnlineControlsTabs() {
  const [value, setValue] = useState<number>(1)
  const { t } = useTranslation("organizers")

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={t("DuringRace.UploadingOnlineControls.tabs1.OE2010.title")} id={"OE2010"} />
          <Tab label={t("DuringRace.UploadingOnlineControls.tabs1.OE12.title")} id={"OE12"} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Typography>{t("DuringRace.UploadingOnlineControls.tabs1.OE2010.p1")}</Typography>
        <img
          src={t("DuringRace.UploadingOnlineControls.tabs1.OE2010.img1.url")}
          alt={t("DuringRace.UploadingOnlineControls.tabs1.OE2010.img1.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
        <Typography>{t("DuringRace.UploadingOnlineControls.tabs1.OE2010.p2")}</Typography>
        <img
          src={t("DuringRace.UploadingOnlineControls.tabs1.OE2010.img2.url")}
          alt={t("DuringRace.UploadingOnlineControls.tabs1.OE2010.img2.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
        <Typography>{t("DuringRace.UploadingOnlineControls.tabs1.OE2010.p3")}</Typography>
        <img
          src={t("DuringRace.UploadingOnlineControls.tabs1.OE2010.img3.url")}
          alt={t("DuringRace.UploadingOnlineControls.tabs1.OE2010.img3.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
        <Typography>{t("DuringRace.UploadingOnlineControls.tabs1.OE2010.p4")}</Typography>
        <img
          src={t("DuringRace.UploadingOnlineControls.tabs1.OE2010.img4.url")}
          alt={t("DuringRace.UploadingOnlineControls.tabs1.OE2010.img4.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Typography>{t("DuringRace.UploadingOnlineControls.tabs1.OE12.p1")}</Typography>
        <img
          src={t("DuringRace.UploadingOnlineControls.tabs1.OE12.img1.url")}
          alt={t("DuringRace.UploadingOnlineControls.tabs1.OE12.img1.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
        <Typography>{t("DuringRace.UploadingOnlineControls.tabs1.OE12.p2")}</Typography>
        <img
          src={t("DuringRace.UploadingOnlineControls.tabs1.OE12.img2.url")}
          alt={t("DuringRace.UploadingOnlineControls.tabs1.OE12.img2.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
        <Typography>{t("DuringRace.UploadingOnlineControls.tabs1.OE12.p3")}</Typography>
        <img
          src={t("DuringRace.UploadingOnlineControls.tabs1.OE12.img3.url")}
          alt={t("DuringRace.UploadingOnlineControls.tabs1.OE12.img3.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
        <Typography>{t("DuringRace.UploadingOnlineControls.tabs1.OE12.p4")}</Typography>
        <img
          src={t("DuringRace.UploadingOnlineControls.tabs1.OE12.img4.url")}
          alt={t("DuringRace.UploadingOnlineControls.tabs1.OE12.img4.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
      </CustomTabPanel>
      <Divider />
    </Box>
  )
}
