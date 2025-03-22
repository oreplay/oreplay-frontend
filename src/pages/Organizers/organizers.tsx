import React from "react"
import { Trans, useTranslation } from "react-i18next"
import {
  Alert,
  Container,
  Typography,
  Button,
  Box,
  Link,
  ListItem,
  AlertTitle,
  createTheme,
  ThemeProvider,
  Theme,
} from "@mui/material"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import UploadStartTimesTabs from "./components/UploadStartTimesTabs.tsx"
import UploadResultTabs from "./components/UploadResultTabs.tsx"
import OrderedList from "../../components/OrderedList.tsx"
import { useQuery } from "react-query"
import getLatestClientVersion from "./services/DesktopClientService.ts"

const DESKTOP_CLIENT_VERSION_FALLBACK = import.meta.env.VITE_DESKTOP_CLIENT_VERSION_FALLBACK

const organizersTheme = (theme: Theme) =>
  createTheme({
    ...theme,
    typography: {
      h1: {
        fontSize: 36,
        fontWeight: 500,
        marginBottom: "1rem",
      },
      h2: {
        marginTop: "48px",
        fontWeight: 500,
        marginBottom: "16px",
        fontSize: 26,
      },
      h3: {
        fontWeight: 500,
        marginBottom: "12px",
        fontSize: 20,
      },
      h4: {
        fontWeight: 500,
        marginBottom: "10px",
        fontSize: 20,
      },
      body1: {
        marginTop: "8px",
        marginBottom: "8px",
      },
    },
  })

const style = {
  alert: {
    my: "1em",
  },
}

const Organizers = (): React.ReactNode => {
  const { t } = useTranslation("organizers")

  const { data: version, isSuccess: successfullInVersionNumber } = useQuery(
    "desktop-client-version",
    getLatestClientVersion,
    {
      retry: false,
    },
  )

  const client_version = successfullInVersionNumber ? version : DESKTOP_CLIENT_VERSION_FALLBACK

  return (
    <ThemeProvider theme={organizersTheme}>
      <Container>
        <Typography variant={"h1"}>{t("Header")}</Typography>
        <Typography>
          <Trans t={t} i18nKey="p1">
            This page contains all the necessary information to upload results to O-Replay. Please
            read it carefully. If you have any issues or questions, feel free to contact us at{" "}
            <Link href={"mailto:support@oreplay.es"}>support@oreplay.es</Link>. Note that O-Replay
            is completely free to use.
          </Trans>
        </Typography>
        <Typography variant="h2">{t("Prerequisites.title")}</Typography>
        <Typography variant="h3">{t("Prerequisites.Registering.title")}</Typography>
        <Typography>
          <Trans t={t} i18nKey="Prerequisites.Registering.p1">
            Currently, the only way to register is by sending an email to{" "}
            <Link href={"mailto:support@oreplay.es"}>support@oreplay.es</Link> with the following
            information (we speak both English and Spanish):
          </Trans>
        </Typography>
        <OrderedList>
          <ListItem>{t("Prerequisites.Registering.list.item1")}</ListItem>
          <ListItem>{t("Prerequisites.Registering.list.item2")}</ListItem>
          <ListItem>{t("Prerequisites.Registering.list.item3")}</ListItem>
        </OrderedList>
        <Typography>{t("Prerequisites.Registering.p2")}</Typography>
        <Typography variant={"h3"}>{t("Prerequisites.DesktopClient.title")}</Typography>
        <Typography variant={"h4"}>
          {t("Prerequisites.DesktopClient.DownloadClient.title")}
        </Typography>
        <Typography>{t("Prerequisites.DesktopClient.DownloadClient.p1")}</Typography>
        <Box sx={{ display: "flex", justifyContent: "center", my: "1em" }}>
          <Button
            variant="outlined"
            href={`https://github.com/oreplay/desktop-client/releases/download/${client_version}/OReplayDesktop.exe`}
            target="_blank"
            startIcon={<FileDownloadIcon />}
          >
            {t("Prerequisites.DesktopClient.DownloadClient.DownloadBtn")}
            <Typography component={"span"} sx={{ textTransform: "none" }}>
              {`\u00A0(v${client_version})`}
            </Typography>
          </Button>
        </Box>
        <Typography>{t("Prerequisites.DesktopClient.DownloadClient.p2")}</Typography>
        <Typography>
          <Trans t={t} i18nkey={"Prerequisites.DesktopClient.DownloadClient.p3"}>
            If you are using other operating systems, such as Linux or macOS, or your Windows 10
            installation fails you can still use the client via{" "}
            <Link
              target={"_blank"}
              href={`https://github.com/oreplay/desktop-client/releases/tag/${client_version}`}
            >
              manual installation
            </Link>
            .
          </Trans>
        </Typography>
        <Typography variant={"h4"}>
          {t("Prerequisites.DesktopClient.ManageClient.title")}
        </Typography>
        <Typography>{t("Prerequisites.DesktopClient.ManageClient.p1")}</Typography>
        <OrderedList>
          <ListItem>
            <Trans i18nKey={"Prerequisites.DesktopClient.ManageClient.list1.item1"} t={t}>
              Open the O-Replay Desktop Client and click "
              <Typography component={"span"} sx={{ fontWeight: "bold" }}>
                Check connection
              </Typography>
              "
            </Trans>
          </ListItem>
          <ListItem>
            <Trans i18nKey={"Prerequisites.DesktopClient.ManageClient.list1.item2"} t={t}>
              Paste the event ID and security token, then click{" "}
              <Typography component={"span"} sx={{ fontWeight: "bold" }}>
                "Enter"
              </Typography>{" "}
              and select the stage you want to upload data to. You will get the event Id and
              security token when you create the event.
            </Trans>
          </ListItem>
          <ListItem>
            <Trans i18nKey={"Prerequisites.DesktopClient.ManageClient.list1.item3"} t={t}>
              Choose the directory where you will export files to, then press{" "}
              <Typography component={"span"} sx={{ fontWeight: "bold" }}>
                "Start"
              </Typography>
              . The client will now monitor this directory for any `XML` file. When you export start
              times or results from your timekeeping software, the client will read the file and
              upload it to O-Replay. Files will be automatically deleted after successful uploads.
            </Trans>
          </ListItem>
        </OrderedList>
        <img
          src={t("Prerequisites.DesktopClient.ManageClient.img1.url")}
          alt={t("Prerequisites.DesktopClient.ManageClient.img1.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
        <Typography>{t("Prerequisites.DesktopClient.ManageClient.p2")}</Typography>
        <Typography variant={"h2"}>{t("BeforeTheRace.title")}</Typography>
        <Typography variant={"h3"}>{t("BeforeTheRace.CreateEvent.title")}</Typography>
        <Typography>{t("BeforeTheRace.CreateEvent.p1")}</Typography>
        <Typography>{t("BeforeTheRace.CreateEvent.p2")}</Typography>
        <Typography>{t("BeforeTheRace.CreateEvent.p3")}</Typography>
        <img
          src={t("BeforeTheRace.CreateEvent.img1.url")}
          alt={t("BeforeTheRace.CreateEvent.img1.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
        <Typography variant={"h3"}>{t("BeforeTheRace.UploadStartTimes.title")}</Typography>
        <Typography>{t("BeforeTheRace.UploadStartTimes.p1")}</Typography>
        <OrderedList>
          <ListItem>{t("BeforeTheRace.UploadStartTimes.list1.item1")}</ListItem>
          <ListItem>{t("BeforeTheRace.UploadStartTimes.list1.item2")}</ListItem>
        </OrderedList>
        <Typography>{t("BeforeTheRace.UploadStartTimes.p2")}</Typography>
        <UploadStartTimesTabs />
        <Typography>{t("BeforeTheRace.UploadStartTimes.p3")}</Typography>
        <Alert severity="info" variant="outlined" sx={style.alert}>
          <AlertTitle>{t("BeforeTheRace.UploadStartTimes.InfoBox1.title")}</AlertTitle>
          {t("BeforeTheRace.UploadStartTimes.InfoBox1.p1")}
        </Alert>
        <Alert severity={"warning"} variant="outlined" sx={style.alert}>
          <AlertTitle>{t("BeforeTheRace.UploadStartTimes.WarnBox1.title")}</AlertTitle>
          {t("BeforeTheRace.UploadStartTimes.WarnBox1.p1")}
        </Alert>
        <Typography variant={"h2"}>{t("DuringRace.title")}</Typography>
        <Typography variant={"h3"}>{t("DuringRace.UploadingResults.title")}</Typography>
        <Typography>{t("DuringRace.UploadingResults.p1")}</Typography>
        <Typography>{t("DuringRace.UploadingResults.p2")}</Typography>
        <UploadResultTabs />
        <Alert severity={"warning"} variant="outlined" sx={style.alert}>
          <AlertTitle>{t("DuringRace.UploadingResults.WarnBox1.title")}</AlertTitle>
          {t("DuringRace.UploadingResults.WarnBox1.p1")}
        </Alert>
        <Alert severity={"warning"} variant="outlined" sx={style.alert}>
          <AlertTitle>{t("DuringRace.UploadingResults.WarnBox2.title")}</AlertTitle>
          {t("DuringRace.UploadingResults.WarnBox2.p1")}
        </Alert>
        <Typography>{t("DuringRace.UploadingResults.p3")}</Typography>
        <Typography>{t("DuringRace.UploadingResults.p4")}</Typography>

        <Typography variant={"h3"}>{t("DuringRace.WhatIfAnythingWrong.title")}</Typography>
        <Typography>{t("DuringRace.WhatIfAnythingWrong.p1")}</Typography>
        <Typography>{t("DuringRace.WhatIfAnythingWrong.p2")}</Typography>
        <img
          src={t("DuringRace.WhatIfAnythingWrong.img1.url")}
          alt={t("DuringRace.WhatIfAnythingWrong.img1.alt")}
          loading={"lazy"}
          style={{
            maxWidth: "100%", // Image will not exceed the container's width
            maxHeight: "100%", // Image will not exceed the container's height
            objectFit: "contain", // Ensures the image fits within its bounds while preserving aspect ratio
          }}
        />
        <Typography>{t("DuringRace.WhatIfAnythingWrong.p3")}</Typography>
      </Container>
    </ThemeProvider>
  )
}

export default Organizers
