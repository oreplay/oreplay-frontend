import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Container, Typography } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

const Organizers = (): React.ReactNode => {
  const { t } = useTranslation("organizers");

  return (
    <Container>
      <Typography variant={"h1"}>{t("Header")}</Typography>
      <Alert icon={<ConstructionIcon />} severity="info" sx={{ mt: "2em" }}>
        {t("DevelopingMsg")}
      </Alert>
    </Container>
  );
};

export default Organizers;
