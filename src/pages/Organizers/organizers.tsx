import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Container, Typography, Button, Box } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

const Organizers = (): React.ReactNode => {
  const { t } = useTranslation("organizers");

  const styles = {
    h2: {
      marginTop: "48px",
      marginBottom: "8px",
    },
    p: {
      marginTop: "8px",
      marginBottom: "8px",
    },
    img: {
      borderColor: "secondary.main",
      borderWidth: "4px",
      borderStyle: "solid",
      marginBottom: "8px",
    }
  }

  return (
    <Container>
      <Typography variant={"h1"}>{t("Header")}</Typography>
      <Alert icon={<ConstructionIcon />} severity="info" sx={{ mt: "2em" }}>
        {t("DevelopingMsg")}
      </Alert>
      <Typography variant={"h2"} sx={styles.h2}>{t("Events.title")}</Typography>
      <Typography sx={styles.p}>{t("Events.paragraph1")}</Typography>
      <Typography sx={styles.p}>{t("Events.paragraph2")}</Typography>
      <Typography sx={styles.p}>{t("Events.paragraph3")}</Typography>
      <Box
        component="img"
        sx={styles.img}
        alt={t("Events.paragraph3")}
        src="/organizers/editEvent.png"
      />
      <Typography variant={"h2"} sx={styles.h2}>{t("Client.title")}</Typography>
      <Typography sx={styles.p}>{t("Client.paragraph1")}</Typography>
      <Button variant="contained" href="https://github.com/oreplay/desktop-client/releases/latest" target="_blank">{t("Client.download")}</Button>
      <Typography sx={styles.p}>{t("Client.paragraph2")}</Typography>
      <Typography sx={styles.p}>{t("Client.paragraph3")}</Typography>
      <Typography sx={styles.p}>{t("Client.paragraph4")}</Typography>
      <Box
        component="img"
        sx={styles.img}
        alt={t("Client.paragraph2")}
        src="/organizers/startClient.png"
      />
      <Typography sx={styles.p}>{t("Client.paragraph5")}</Typography>
      <Typography sx={styles.p}>{t("Client.paragraph6")}</Typography>
      <Typography sx={styles.p}>{t("Client.paragraph7")}</Typography>
      <Typography sx={styles.p}>{t("Client.paragraph8")}</Typography>
      <Typography sx={styles.p}>{t("Client.paragraph9")}</Typography>
      <Typography sx={styles.p}>{t("Client.paragraph10")}</Typography>
      <Box
        component="img"
        sx={styles.img}
        alt={t("Client.paragraph10")}
        src="/organizers/splitsExport.jpg"
      />
      <Typography sx={styles.p}>{t("Client.paragraph11")}</Typography>
    </Container>
  );
};

export default Organizers;
